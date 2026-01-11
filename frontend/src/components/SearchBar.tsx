import { Component, createSignal, createEffect, createMemo, For, Show, onMount, onCleanup } from 'solid-js';
import styles from './SearchBar.module.css';
import clsx from 'clsx';
import TabsContent from './TabsContent/TabsContent';
import DatePicker, { DatePickerRef } from './DatePicker/DatePicker';
import Forecast from './Forecast/Forecast';
import Modal from './Modal/Modal';

const STEPS = [
  { id: 'question', title: 'Вопрос', fullTitle: 'Задайте ваш вопрос' },
  { id: 'place', title: 'Место рождения', fullTitle: 'Место рождения' },
  { id: 'time', title: 'Дата рождения', fullTitle: 'Дата рождения' },
];

interface OsmPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const TABS_ORDER = ['question', 'place', 'time', 'forecast'];

const SearchBar: Component = () => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [currentTab, setCurrentTab] = createSignal('question');
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [questionValue, setQuestionValue] = createSignal('');
  const [timeValue, setTimeValue] = createSignal('');
  const [yearValue, setYearValue] = createSignal('');
  const [currentDate, setCurrentDate] = createSignal<Date | null>(null);
  const [isUpdatingFromPicker, setIsUpdatingFromPicker] = createSignal(false);
  let datePickerRef: DatePickerRef | null = null;

  const [placeValue, setPlaceValue] = createSignal('');
  const [suggestions, setSuggestions] = createSignal<OsmPlace[]>([]);
  const [selectedCoords, setSelectedCoords] = createSignal<{ lat: number; lon: number } | null>(null);
  const [selectedPlace, setSelectedPlace] = createSignal<OsmPlace | null>(null);
  const [isLoadingPlaces, setIsLoadingPlaces] = createSignal(false);
  const [isPlaceInputFocused, setIsPlaceInputFocused] = createSignal(false);
  const [hasSearched, setHasSearched] = createSignal(false);
  const [isManualInput, setIsManualInput] = createSignal(false);
  const [manualLat, setManualLat] = createSignal('');
  const [manualLon, setManualLon] = createSignal('');
  const [agreeToSubmit, setAgreeToSubmit] = createSignal(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = createSignal(false);
  let debounceTimer: number | null = null;


  const searchPlaces = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    setIsLoadingPlaces(true);
    try {
      // Используем Nominatim API для поиска
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&accept-language=ru`
      );
      
      if (response.ok) {
        const data: OsmPlace[] = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const handlePlaceInput = (e: InputEvent) => {
    const value = (e.currentTarget as HTMLInputElement).value;
    
    // Если есть выбранное место, разрешаем только очистку
    if (selectedCoords() && selectedPlace()) {
      if (value === '') {
        // Пользователь очистил input - сбрасываем выбор
        setPlaceValue('');
        setSelectedCoords(null);
        setSelectedPlace(null);
        setSuggestions([]);
      } else {
        // Пытаются редактировать выбранное место - не разрешаем
        // Восстанавливаем значение из selectedPlace
        setPlaceValue(selectedPlace()!.display_name);
      }
      return;
    }
    
    // Если нет выбранного места, разрешаем ввод
    setPlaceValue(value);

    if (debounceTimer) window.clearTimeout(debounceTimer);
    
    // Debounce запрос на 500мс
    debounceTimer = window.setTimeout(() => {
      searchPlaces(value);
    }, 500);
  };

  const handleSelectPlace = (place: OsmPlace) => {
    // Проверяем, не выбран ли уже этот элемент
    const currentPlace = selectedPlace();
    if (currentPlace && 
        Math.abs(parseFloat(place.lat) - parseFloat(currentPlace.lat)) < 0.0001 &&
        Math.abs(parseFloat(place.lon) - parseFloat(currentPlace.lon)) < 0.0001) {
      // Повторный клик - сбрасываем выбор
      setPlaceValue('');
      setSelectedCoords(null);
      setSelectedPlace(null);
      setSuggestions([]);
      return;
    }
    
    // Выбираем новое место
    setPlaceValue(place.display_name);
    setSelectedCoords({
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon)
    });
    setSelectedPlace(place);
    setSuggestions([]); // Скрываем список
    setIsPlaceInputFocused(false);
    console.log('Selected Place:', place.display_name, place.lat, place.lon);
  };

  const handleClearPlace = () => {
    setPlaceValue('');
    setSelectedCoords(null);
    setSelectedPlace(null);
    setSuggestions([]);
    setHasSearched(false);
    setIsPlaceInputFocused(false);
    setIsManualInput(false);
    setManualLat('');
    setManualLon('');
    // Фокусируемся на input после очистки
    setTimeout(() => {
      placeInputRef?.focus();
    }, 0);
  };

  // Format date input: dd.mm.yyyy
  const formatDateInput = (value: string, previousValue: string = ''): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    const previousDigits = previousValue.replace(/\D/g, '');
    
    // If user is deleting and digits count didn't change, they deleted a separator
    // In this case, allow the deletion without immediate reformatting
    if (value.length < previousValue.length && digits.length === previousDigits.length) {
      // Return the value as-is if it's shorter (user deleted separator)
      return value;
    }
    
    // Apply mask dd.mm.yyyy
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
    }
  };

  // Format latitude input: -XX.XXXXXX (строгая маска как для даты/времени)
  const formatLatitudeInput = (value: string, previousValue: string = ''): string => {
    // Удаляем все символы кроме цифр и минуса
    const digits = value.replace(/[^\d-]/g, '');
    const previousDigits = previousValue.replace(/[^\d-]/g, '');
    
    // Если пользователь удаляет и количество цифр не изменилось, они удалили разделитель
    if (value.length < previousValue.length && digits.length === previousDigits.length) {
      return value;
    }
    
    // Обрабатываем минус - только в начале
    let hasMinus = false;
    let cleanedDigits = digits;
    if (digits.startsWith('-')) {
      hasMinus = true;
      cleanedDigits = digits.substring(1);
    } else if (digits.includes('-')) {
      // Если минус не в начале, убираем его
      cleanedDigits = digits.replace(/-/g, '');
    }
    
    // Ограничиваем количество цифр: максимум 2 до точки, 6 после
    let integerPart = cleanedDigits.substring(0, 2);
    let decimalPart = cleanedDigits.substring(2, 8);
    
    // Форматируем результат
    let result = hasMinus ? '-' + integerPart : integerPart;
    if (decimalPart.length > 0) {
      result += '.' + decimalPart;
    }
    
    return result;
  };

  // Format longitude input: -XXX.XXXXXX (строгая маска как для даты/времени)
  const formatLongitudeInput = (value: string, previousValue: string = ''): string => {
    // Удаляем все символы кроме цифр и минуса
    const digits = value.replace(/[^\d-]/g, '');
    const previousDigits = previousValue.replace(/[^\d-]/g, '');
    
    // Если пользователь удаляет и количество цифр не изменилось, они удалили разделитель
    if (value.length < previousValue.length && digits.length === previousDigits.length) {
      return value;
    }
    
    // Обрабатываем минус - только в начале
    let hasMinus = false;
    let cleanedDigits = digits;
    if (digits.startsWith('-')) {
      hasMinus = true;
      cleanedDigits = digits.substring(1);
    } else if (digits.includes('-')) {
      // Если минус не в начале, убираем его
      cleanedDigits = digits.replace(/-/g, '');
    }
    
    // Ограничиваем количество цифр: максимум 3 до точки, 6 после
    let integerPart = cleanedDigits.substring(0, 3);
    let decimalPart = cleanedDigits.substring(3, 9);
    
    // Форматируем результат
    let result = hasMinus ? '-' + integerPart : integerPart;
    if (decimalPart.length > 0) {
      result += '.' + decimalPart;
    }
    
    return result;
  };

  // Format time input: hh:mm:ss
  const formatTimeInput = (value: string, previousValue: string = ''): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    const previousDigits = previousValue.replace(/\D/g, '');
    
    // If user is deleting and digits count didn't change, they deleted a separator
    // In this case, allow the deletion without immediate reformatting
    if (value.length < previousValue.length && digits.length === previousDigits.length) {
      // Return the value as-is if it's shorter (user deleted separator)
      return value;
    }
    
    // Apply mask hh:mm:ss
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4, 6)}`;
    }
  };

  // Format date to string: dd.mm.yyyy
  const formatDateToString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}.${month}.${year}`;
  };

  // Format time to string: hh:mm:ss
  const formatTimeToString = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Validate date string: dd.mm.yyyy
  const isValidDate = (dateStr: string): boolean => {
    if (dateStr.length !== 10) return false;
    const parts = dateStr.split('.');
    if (parts.length !== 3) return false;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1000 || year > 3000) return false;
    
    // Check if date is valid
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
  };

  // Validate time string: hh:mm:ss
  const isValidTime = (timeStr: string): boolean => {
    if (timeStr.length < 5) return false;
    const parts = timeStr.split(':');
    if (parts.length < 2) return false;
    
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parts[2] ? parseInt(parts[2], 10) : 0;
    
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return false;
    if (hours < 0 || hours > 23) return false;
    if (minutes < 0 || minutes > 59) return false;
    if (seconds < 0 || seconds > 59) return false;
    
    return true;
  };

  // Parse date string to Date object
  const parseDateString = (dateStr: string): Date | null => {
    if (!isValidDate(dateStr)) return null;
    const parts = dateStr.split('.');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return new Date(year, month - 1, day);
  };

  // Parse time string and combine with current date
  const parseTimeString = (timeStr: string, baseDate: Date): Date | null => {
    if (!isValidTime(timeStr)) return null;
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parts[2] ? parseInt(parts[2], 10) : 0;
    
    const newDate = new Date(baseDate);
    newDate.setHours(hours, minutes, seconds);
    return newDate;
  };

  // Handle DatePicker change - update input only after animation stops
  let pickerUpdateTimeout: number | null = null;
  const handleDatePickerChange = (date: Date) => {
    setCurrentDate(date);
    
    // Clear existing timeout
    if (pickerUpdateTimeout !== null) {
      clearTimeout(pickerUpdateTimeout);
    }
    
    // Update inputs only after animation stops (delay)
    pickerUpdateTimeout = window.setTimeout(() => {
      setIsUpdatingFromPicker(true);
      setYearValue(formatDateToString(date));
      setTimeValue(formatTimeToString(date));
      setIsUpdatingFromPicker(false);
      pickerUpdateTimeout = null;
    }, 500); // Delay to wait for animation to complete
  };

  
  let textareaRef: HTMLTextAreaElement | undefined;
  let wrapperRef: HTMLDivElement | undefined;
  let searchInputRef: HTMLDivElement | undefined;
  let containerRef: HTMLDivElement | undefined;
  let overlayContentRef: HTMLDivElement | undefined;
  let stepsRef: HTMLDivElement | undefined;
  let placeInputRef: HTMLInputElement | undefined;

  const applyFormPosition = () => {
    if (wrapperRef && textareaRef && searchInputRef) {
      setIsAnimating(true);
      
      // Получаем текущую позицию wrapper и searchInput
      const wrapperRect = wrapperRef.getBoundingClientRect();
      const searchInputRect = searchInputRef.getBoundingClientRect();
      
      // Получаем реальные размеры и позицию textarea из формы
      const textareaRect = textareaRef.getBoundingClientRect();
      textareaRef.style.opacity = '1';
      
      // Устанавливаем начальную позицию wrapper (текущая позиция)
      wrapperRef.style.transition = 'none';
      wrapperRef.style.position = 'fixed';
      wrapperRef.style.top = `${wrapperRect.top}px`;
      wrapperRef.style.left = `${wrapperRect.left}px`;
      wrapperRef.style.width = `${wrapperRect.width}px`;
      wrapperRef.style.height = `${wrapperRect.height}px`;
      wrapperRef.style.boxSizing = 'border-box';
      wrapperRef.style.borderRadius = 'var(--radius-full)';
      // Скрываем анимацию границы
      wrapperRef.classList.add(styles.wrapperAnimating);
      
      // Устанавливаем начальные размеры searchInput
      searchInputRef.style.transition = 'none';
      searchInputRef.style.opacity = '';
      searchInputRef.style.width = `${searchInputRect.width}px`;
      searchInputRef.style.height = `${searchInputRect.height}px`;
      searchInputRef.style.borderRadius = 'var(--radius-full)';
      
      // Force reflow
      wrapperRef.offsetHeight;
      searchInputRef.offsetHeight;
      
      // Анимируем wrapper к той же позиции что и textarea (ниже по z-index)
      wrapperRef.style.transition = 'all 0.5s ease';
      wrapperRef.style.top = `${textareaRect.top}px`;
      wrapperRef.style.left = `${textareaRect.left}px`;
      wrapperRef.style.width = `${textareaRect.width}px`;
      wrapperRef.style.height = `${textareaRect.height}px`;
      wrapperRef.style.borderRadius = 'var(--radius-lg)';
      wrapperRef.style.opacity = '0';
      wrapperRef.style.pointerEvents = 'none';
      
      // Анимируем searchInput к размерам и закруглениям textarea
      searchInputRef.style.transition = 'all 0.5s ease';
      searchInputRef.style.width = `${textareaRect.width}px`;
      searchInputRef.style.height = `${textareaRect.height}px`;
      searchInputRef.style.borderRadius = 'var(--radius-lg)';
      
      // После завершения анимации просто завершаем анимацию
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  const resetFormPosition = () => {
    if (wrapperRef && containerRef && textareaRef && searchInputRef) {
      // Скрываем форму сразу
      setIsExpanded(false);
      setCurrentTab('question');
      
      setIsAnimating(true);
      
      // Получаем реальные размеры и позицию textarea из формы
      const textareaRect = textareaRef.getBoundingClientRect();
      const containerRect = containerRef.getBoundingClientRect();
      
      // Получаем размеры searchInput из textarea (для начала анимации)
      const searchInputInitialWidth = textareaRect.width;
      const searchInputInitialHeight = textareaRect.height;

      textareaRef.style.opacity = '0';
      
      // Устанавливаем начальную позицию wrapper (позиция textarea)
      wrapperRef.style.transition = 'none';
      wrapperRef.style.position = 'fixed';
      wrapperRef.style.top = `${textareaRect.top}px`;
      wrapperRef.style.left = `${textareaRect.left}px`;
      wrapperRef.style.width = `${textareaRect.width}px`;
      wrapperRef.style.height = `${textareaRect.height}px`;
      wrapperRef.style.boxSizing = 'border-box';
      wrapperRef.style.zIndex = '99';
      wrapperRef.style.pointerEvents = 'auto';
      wrapperRef.style.borderRadius = 'var(--radius-lg)';
      // Скрываем анимацию границы
      wrapperRef.classList.add(styles.wrapperAnimating);
      
      // Устанавливаем начальные размеры searchInput (размеры textarea)
      searchInputRef.style.transition = 'none';
      searchInputRef.style.width = `${searchInputInitialWidth}px`;
      searchInputRef.style.height = `${searchInputInitialHeight}px`;
      searchInputRef.style.borderRadius = 'var(--radius-lg)';
      
      // Force reflow
      wrapperRef.offsetHeight;
      searchInputRef.offsetHeight;
      
      // Анимируем wrapper обратно к оригинальной позиции
      wrapperRef.style.transition = 'all 0.5s ease';
      wrapperRef.style.top = `${containerRect.top}px`;
      wrapperRef.style.left = `${containerRect.left}px`;
      wrapperRef.style.transform = 'none';
      wrapperRef.style.width = `${containerRect.width}px`;
      wrapperRef.style.height = `${containerRect.height}px`;
      wrapperRef.style.borderRadius = 'var(--radius-full)';
      wrapperRef.style.opacity = '1';
      wrapperRef.style.pointerEvents = '';

      // Анимируем searchInput обратно к оригинальным размерам и закруглениям
      searchInputRef.style.transition = 'all 0.5s ease';
      searchInputRef.style.width = `${containerRect.width}px`;
      searchInputRef.style.height = `${containerRect.height}px`;
      searchInputRef.style.borderRadius = 'var(--radius-full)';
      
      setTimeout(() => {
        if (wrapperRef) {
          wrapperRef.style.transition = '';
          wrapperRef.style.position = '';
          wrapperRef.style.top = '';
          wrapperRef.style.left = '';
          wrapperRef.style.transform = '';
          wrapperRef.style.width = '';
          wrapperRef.style.height = '';
          wrapperRef.style.boxSizing = '';
          wrapperRef.style.zIndex = '';
          wrapperRef.style.opacity = '';
          wrapperRef.style.pointerEvents = '';
          wrapperRef.style.background = '';
          wrapperRef.style.borderRadius = '';
          wrapperRef.style.padding = '';
          wrapperRef.classList.remove(styles.wrapperAnimating);
        }
        if (searchInputRef) {
          searchInputRef.style.transition = '';
          searchInputRef.style.width = '';
          searchInputRef.style.height = '';
          searchInputRef.style.borderRadius = '';
          searchInputRef.style.opacity = '';
        }
        setIsAnimating(false);
      }, 500);
    }
  };

  const handleInputClick = () => {
    setIsExpanded(true);
    setCurrentTab('question');
    
    // Ждем рендеринга формы и textarea, затем запускаем анимацию
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Дополнительная задержка для гарантии рендеринга textarea
        setTimeout(() => {
          applyFormPosition();
        }, 50);
      });
    });
  };

  const handleClose = () => {
    resetFormPosition();
  };

  const handleResize = () => {
    if (isExpanded() && !isAnimating() && wrapperRef && textareaRef && searchInputRef) {
      const textareaRect = textareaRef.getBoundingClientRect();
      
      wrapperRef.style.top = `${textareaRect.top}px`;
      wrapperRef.style.left = `${textareaRect.left}px`;
      wrapperRef.style.width = `${textareaRect.width}px`;
      wrapperRef.style.height = `${textareaRect.height}px`;
    }
  };

  onMount(() => {
    window.addEventListener('resize', handleResize);
    
    // Initialize date
    const now = new Date();
    setCurrentDate(now);
    setYearValue(formatDateToString(now));
    setTimeValue(formatTimeToString(now));
  });

  onCleanup(() => {
    window.removeEventListener('resize', handleResize);
    
    // Cleanup timeout
    if (pickerUpdateTimeout !== null) {
      clearTimeout(pickerUpdateTimeout);
    }
  });

  const getCurrentStepIndex = () => {
    return TABS_ORDER.indexOf(currentTab());
  };

  const currentStepIndex = createMemo(() => TABS_ORDER.indexOf(currentTab()));

  const handleBack = () => {
    if (currentTab() === 'forecast') {
      setIsConfirmModalOpen(true);
      return;
    }
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentTab(TABS_ORDER[currentIndex - 1]);
    } else {
      resetState();
      handleClose();
    }
  };

  const resetState = () => {
    setQuestionValue('');
    setTimeValue('');
    setYearValue('');
    setCurrentDate(null);
    setPlaceValue('');
    setSuggestions([]);
    setSelectedCoords(null);
    setSelectedPlace(null);
    setIsLoadingPlaces(false);
    setIsPlaceInputFocused(false);
    setHasSearched(false);
    setIsManualInput(false);
    setManualLat('');
    setManualLon('');
    setAgreeToSubmit(false);
  };

  const handleNewQuestion = () => {
    resetState();
    setIsConfirmModalOpen(false);
    // Если уже на табе question, сначала переключаемся на другой таб, чтобы createEffect сработал
    if (currentTab() === 'question') {
      setCurrentTab('place');
      setTimeout(() => {
        setCurrentTab('question');
        setTimeout(() => {
          if (textareaRef) {
            textareaRef.style.opacity = '1';
            textareaRef.focus();
          }
        }, 50);
      }, 50);
    } else {
      setCurrentTab('question');
      setTimeout(() => {
        if (textareaRef) {
          textareaRef.style.opacity = '1';
          textareaRef.focus();
        }
      }, 100);
    }
  };

  const handleConfirmClose = () => {
    resetState();
    setIsConfirmModalOpen(false);
    handleClose();
  };

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    const currentTabValue = currentTab();
    
    // Если мы на шаге "Дата рождения" (time) и нажали "Отправить" с галочкой, переходим на Forecast
    if (currentTabValue === 'time' && agreeToSubmit()) {
      setCurrentTab('forecast');
      console.log('Submit form');
      // Здесь можно добавить отправку данных на сервер
    } else if (currentIndex < TABS_ORDER.length - 1) {
      setCurrentTab(TABS_ORDER[currentIndex + 1]);
    } else {
      console.log('Submit form');
    }
  };

  createEffect(() => {
    if (isExpanded() && textareaRef && currentTab() === 'question' && !isAnimating()) {
      textareaRef.focus();
    }
  });

  // ScrollIntoView для активного шага
  createEffect(() => {
    if (stepsRef && isExpanded() && currentTab() !== 'forecast') {
      // Используем setTimeout для того, чтобы дождаться завершения анимации переключения табов
      setTimeout(() => {
        const activeStep = stepsRef?.querySelector(`#step-${currentTab()}`);
        if (activeStep) {
          activeStep.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 100);
    }
  });

  // Автофокус на place input при открытии таба
  let previousTab = currentTab();
  createEffect(() => {
    const currentTabValue = currentTab();
    // Отслеживаем когда открылся новый таб 'place'
    if (currentTabValue === 'place' && previousTab !== 'place') {
      setTimeout(() => {
        // Проверяем условия перед установкой фокуса
        if (placeInputRef && !selectedPlace() && currentTab() === 'place') {
          placeInputRef.focus();
        }
      }, 300);
    }
    previousTab = currentTabValue;
  });

  createEffect(() => {
    if (currentTab() !== 'question' || !textareaRef) {
      return;
    }

    textareaRef.style.opacity = '1';
  }, [currentTab()]);

  // Валидация полей
  const isQuestionValid = createMemo(() => {
    const value = questionValue().trim();
    return value.length >= 10; // Минимум 10 символов
  });

  const isPlaceValid = createMemo(() => {
    // Валидно если есть выбранное OSM место или ручной ввод с координатами, и input не в фокусе
    return (selectedPlace() !== null || (isManualInput() && selectedCoords() !== null)) && !isPlaceInputFocused();
  });

  const isTimeValid = createMemo(() => {
    const value = timeValue().trim();
    // Простая валидация времени (формат HH:MM или HH:MM:SS)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    return value.length >= 4 && (timeRegex.test(value) || value.length >= 3); // Минимум 3 символа или валидный формат времени
  });

  const isCurrentTabValid = createMemo(() => {
    const tab = currentTab();
    if (tab === 'question') return isQuestionValid();
    if (tab === 'place') return isPlaceValid();
    if (tab === 'time') return isTimeValid();
    if (tab === 'forecast') return true; // Forecast всегда валиден
    return false;
  });

  const tabs = {
    question: () => (
      <div class={styles.tabPanel}>
        <Show when={currentTab() === 'question'}>
          <textarea 
            id='questionTextarea' 
            class={styles.questionTextarea}
            placeholder="Напишите ваш вопрос здесь..." 
            ref={(el) => textareaRef = el}
            value={questionValue()}
            onInput={(e) => setQuestionValue(e.currentTarget.value)}
          />
        </Show>
        <button 
          class={styles.nextButton}
          classList={{ [styles.nextButtonDisabled]: !isCurrentTabValid() }}
          onClick={handleNext}
          disabled={!isCurrentTabValid()}
        >
          {currentTab() === 'time' ? 'Отправить' : 'Далее'}
        </button>
      </div>
    ),
    place: () => (
      <div class={styles.tabPanel}>
        <div class={styles.inputWrapper}>
          <div class={styles.inputWrapperInner}>
            <input 
              ref={placeInputRef}
              type="text" 
              class={styles.formInput}
              placeholder="Напишите город (например: Москва)"
              value={isManualInput() && selectedCoords() 
                ? `Ручной ввод, Широта: ${selectedCoords()!.lat.toFixed(6)}, Долгота: ${selectedCoords()!.lon.toFixed(6)}`
                : placeValue()}
              disabled={selectedPlace() !== null || isManualInput()}
              onInput={handlePlaceInput}
              onFocus={() => {
                setIsPlaceInputFocused(true);
                // Очищаем input и сбрасываем выбор при фокусе только если нет выбранного места и не ручной ввод
                if (!selectedPlace() && !isManualInput()) {
                  setPlaceValue('');
                  setSelectedCoords(null);
                  setSelectedPlace(null);
                  setSuggestions([]);
                  setHasSearched(false);
                }
              }}
              onBlur={() => setIsPlaceInputFocused(false)}
            />
            <Show when={selectedPlace() !== null && !isManualInput()}>
              <button
                class={styles.clearButton}
                onClick={handleClearPlace}
                type="button"
              >
                ✕
              </button>
            </Show>
            <Show when={isLoadingPlaces() && selectedPlace() === null}>
              <div class={styles.loadingSpinner}></div>
            </Show>
          </div>

           {/* Список подсказок OSM */}
             <div class={styles.suggestionsContainer}>
               <div class={styles.suggestionsHeader}>
                 <div class={styles.suggestionsHeaderRow}>
                   <button 
                     class={styles.nextButton}
                     classList={{ [styles.nextButtonDisabled]: !isCurrentTabValid() }}
                     onClick={handleNext}
                     disabled={!isCurrentTabValid()}
                   >
                     {currentTab() === 'time' ? 'Отправить' : 'Далее'}
                   </button>
                   <Show when={!selectedPlace() || isManualInput()}>
                     <label class={styles.toggleLabel}>
                       <input
                         type="checkbox"
                         checked={isManualInput()}
                         onChange={(e) => {
                           setIsManualInput(e.currentTarget.checked);
                           if (e.currentTarget.checked) {
                             // Очищаем при включении ручного ввода
                             setPlaceValue('');
                             setSelectedPlace(null);
                             setSuggestions([]);
                             setHasSearched(false);
                             if (selectedCoords()) {
                               setManualLat(selectedCoords()!.lat.toString());
                               setManualLon(selectedCoords()!.lon.toString());
                             }
                           } else {
                             // Очищаем при выключении
                             setManualLat('');
                             setManualLon('');
                             setSelectedCoords(null);
                           }
                         }}
                       />
                       <span style="max-width: 130px;">Вписать<br />координаты</span>
                     </label>
                   </Show>
                 </div>
                 <div class={styles.suggestionsCaption}>
                   <Show when={selectedPlace()} fallback={
                     <>{isManualInput() ? 'Впишите координаты' : 'Выберите локацию'}</>
                   }>
                     {isManualInput() ? 'Впишите координаты' : 'Выберите локацию'}
                   </Show>
                 </div>
               </div>
               <Show when={selectedPlace()} fallback={
                 <>
                   <Show when={isManualInput()}>
                     <div class={styles.manualInputs}>
                       <input
                         type="text"
                         class={styles.formInput}
                         placeholder="Широта (-90 до 90)"
                         value={manualLat()}
                         onInput={(e) => {
                           const previousValue = manualLat();
                           const formatted = formatLatitudeInput(e.currentTarget.value, previousValue);
                           setManualLat(formatted);
                           const lat = parseFloat(formatted);
                           if (!isNaN(lat) && lat >= -90 && lat <= 90) {
                             const lon = parseFloat(manualLon()) || 0;
                             if (!isNaN(lon) && lon >= -180 && lon <= 180) {
                               setSelectedCoords({ lat, lon });
                             }
                           }
                         }}
                       />
                       <input
                         type="text"
                         class={styles.formInput}
                         placeholder="Долгота (-180 до 180)"
                         value={manualLon()}
                         onInput={(e) => {
                           const previousValue = manualLon();
                           const formatted = formatLongitudeInput(e.currentTarget.value, previousValue);
                           setManualLon(formatted);
                           const lon = parseFloat(formatted);
                           if (!isNaN(lon) && lon >= -180 && lon <= 180) {
                             const lat = parseFloat(manualLat()) || 0;
                             if (!isNaN(lat) && lat >= -90 && lat <= 90) {
                               setSelectedCoords({ lat, lon });
                             }
                           }
                         }}
                       />
                     </div>
                   </Show>
                   <Show when={suggestions().length > 0} fallback={
                     <Show when={hasSearched()} fallback={
                       <Show when={!isManualInput()}>
                         <div class={styles.suggestionsEmpty}>Начните вводить населенный пункт</div>
                       </Show>
                     }>
                       <div class={styles.suggestionsEmpty}>Ничего не найдено</div>
                     </Show>
                   }>
                     <ul class={styles.suggestionsList}>
                       <For each={suggestions()}>
                         {(item) => {
                           const isSelected = () => {
                             const currentPlace = selectedPlace();
                             return !!(currentPlace && 
                               Math.abs(parseFloat(item.lat) - parseFloat(currentPlace.lat)) < 0.0001 &&
                               Math.abs(parseFloat(item.lon) - parseFloat(currentPlace.lon)) < 0.0001);
                           };
                           
                           return (
                             <li 
                               class={styles.suggestionItem}
                               classList={{ [styles.suggestionItemSelected]: isSelected() }}
                               onClick={() => handleSelectPlace(item)}
                             >
                               <div class={styles.suggestionName}>{item.display_name}</div>
                               <div class={styles.suggestionCoords}>
                                 Широта: {parseFloat(item.lat).toFixed(6)}, Долгота: {parseFloat(item.lon).toFixed(6)}
                               </div>
                             </li>
                           );
                         }}
                       </For>
                     </ul>
                   </Show>
                 </>
               }>
                 <div style='margin-top: 8px;' class={styles.suggestionsEmpty}>Локация выбрана!</div>
               </Show>
             </div>
        </div>
      </div>
    ),
    time: () => (
      <div class={styles.tabPanel}>
        <div class={styles.inputsRow}>
          <input 
            type="text" 
            class={styles.formInput}
            placeholder="Дата (dd.mm.yyyy)"
            value={yearValue()}
            onInput={(e) => {
              if (isUpdatingFromPicker()) return;
              const previousValue = yearValue();
              const formatted = formatDateInput(e.currentTarget.value, previousValue);
              setYearValue(formatted);
              
              // If date is completely filled and valid, apply to DatePicker immediately
              if (formatted.length === 10 && isValidDate(formatted)) {
                const parsedDate = parseDateString(formatted);
                if (parsedDate) {
                  // Combine with current time if available, otherwise use midnight
                  const newDate = new Date(parsedDate);
                  if (currentDate()) {
                    newDate.setHours(currentDate()!.getHours());
                    newDate.setMinutes(currentDate()!.getMinutes());
                    newDate.setSeconds(currentDate()!.getSeconds());
                  }
                  setCurrentDate(newDate);
                  // Update DatePicker via ref
                  const updatePicker = () => {
                    if (datePickerRef && datePickerRef.setDate) {
                      datePickerRef.setDate(newDate);
                    } else {
                      // Retry if ref is not set yet
                      setTimeout(updatePicker, 100);
                    }
                  };
                  updatePicker();
                }
              }
            }}
            onBlur={(e) => {
              if (isUpdatingFromPicker()) return;
              
              const formatted = e.currentTarget.value;
              
              // If date is invalid, restore from DatePicker state
              if (formatted.length !== 10 || !isValidDate(formatted)) {
                if (currentDate()) {
                  setIsUpdatingFromPicker(true);
                  setYearValue(formatDateToString(currentDate()!));
                  setIsUpdatingFromPicker(false);
                }
              }
            }}
            maxLength={10}
          />
          <input 
            type="text" 
            class={styles.formInput}
            placeholder="Время (hh:mm:ss)"
            value={timeValue()}
            onInput={(e) => {
              if (isUpdatingFromPicker()) return;
              const previousValue = timeValue();
              const formatted = formatTimeInput(e.currentTarget.value, previousValue);
              setTimeValue(formatted);
              
              // If time is completely filled and valid, apply to DatePicker immediately
              if (formatted.length === 8 && isValidTime(formatted) && currentDate()) {
                const parsedDate = parseTimeString(formatted, currentDate()!);
                if (parsedDate) {
                  setCurrentDate(parsedDate);
                  // Update DatePicker via ref
                  const updatePicker = () => {
                    if (datePickerRef && datePickerRef.setDate) {
                      datePickerRef.setDate(parsedDate);
                    } else {
                      // Retry if ref is not set yet
                      setTimeout(updatePicker, 100);
                    }
                  };
                  updatePicker();
                }
              }
            }}
            onBlur={(e) => {
              if (isUpdatingFromPicker()) return;
              
              const formatted = e.currentTarget.value;
              
              // If time is invalid, restore from DatePicker state
              if (formatted.length !== 8 || !isValidTime(formatted)) {
                if (currentDate()) {
                  setIsUpdatingFromPicker(true);
                  setTimeValue(formatTimeToString(currentDate()!));
                  setIsUpdatingFromPicker(false);
                }
              }
            }}
            maxLength={8}
          />
        </div>
        <div class={styles.datePicker}>
          <DatePicker 
            value={currentDate() || undefined}
            onChange={handleDatePickerChange}
            ref={(ref) => { datePickerRef = ref; }}
          />
        </div>
        
          <Show when={currentTab() === 'time'}>
            <div class={styles.submitSection}>
              <div class={styles.dataRow}>
                <div class={styles.dataCard}>
                <span class={styles.dataLabel}>Координаты рождения</span>
                <span class={styles.dataValue}>
                  {selectedPlace() 
                    ? `${parseFloat(selectedPlace()!.lat).toFixed(6)}, ${parseFloat(selectedPlace()!.lon).toFixed(6)}`
                    : isManualInput() && selectedCoords()
                      ? `${selectedCoords()!.lat.toFixed(6)}, ${selectedCoords()!.lon.toFixed(6)}`
                      : 'Не указано'}
                </span>
                </div>
                <div class={styles.dataCard}>
                  <span class={styles.dataLabel}>Дата рождения</span>
                  <span class={styles.dataValue}>
                    {currentDate() 
                      ? `${currentDate()!.getDate().toString().padStart(2, '0')}.${(currentDate()!.getMonth() + 1).toString().padStart(2, '0')}.${currentDate()!.getFullYear()} ${currentDate()!.getHours().toString().padStart(2, '0')}:${currentDate()!.getMinutes().toString().padStart(2, '0')}:${currentDate()!.getSeconds().toString().padStart(2, '0')}`
                      : 'Не указана'}
                  </span>
                </div>
              </div>
              <div class={styles.dataCard}>
                  <span class={styles.dataLabel}>Вопрос</span>
                  <span class={styles.dataValue}>{questionValue() || 'Не указан'}</span>
              </div>
            
            <label class={styles.agreeLabel}>
              <input
                type="checkbox"
                checked={agreeToSubmit()}
                onChange={(e) => setAgreeToSubmit(e.currentTarget.checked)}
              />
              <span>Данные верны, отправляю на рассчет</span>
            </label>
          </div>
        </Show>
        
        <button 
          class={styles.nextButton}
          classList={{ [styles.nextButtonDisabled]: !isCurrentTabValid() || (currentTab() === 'time' && !agreeToSubmit()) }}
          onClick={handleNext}
          disabled={!isCurrentTabValid() || (currentTab() === 'time' && !agreeToSubmit())}
        >
          {currentTab() === 'time' ? 'Отправить' : 'Далее'}
        </button>
      </div>
    ),
    forecast: () => {
      // Формируем данные для Forecast
      const placeData = selectedPlace() 
        ? {
            name: selectedPlace()!.display_name,
            lat: parseFloat(selectedPlace()!.lat),
            lon: parseFloat(selectedPlace()!.lon)
          }
        : isManualInput() && selectedCoords()
          ? {
              name: `Ручной ввод, Широта: ${selectedCoords()!.lat.toFixed(6)}, Долгота: ${selectedCoords()!.lon.toFixed(6)}`,
              lat: selectedCoords()!.lat,
              lon: selectedCoords()!.lon
            }
          : null;

      return (
        <div class={styles.tabPanel}>
          <Forecast 
            question={questionValue()}
            date={currentDate()}
            place={placeData}
          />
        </div>
      );
    },
  };

  return (
    <div class={styles.root}>
        <div 
          class={clsx(styles.overlay, isExpanded() && styles.overlayVisible)}
        >
          <div class={styles.overlayContent} ref={(el) => overlayContentRef = el}>
            {/* Header с кнопкой назад, названием и steps */}
            <div class={styles.formHeader}>
              <button class={styles.backButton} onClick={handleBack}>
                <Show when={currentTab() === 'forecast'} fallback={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                }>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </Show>
              </button>
              {/* <span class={styles.headerTitle}>
                {STEPS.find(s => s.id === currentTab())?.fullTitle || STEPS[0].fullTitle}
              </span> */}
              <div class={styles.stepsWrapper}>
                <div class={clsx(styles.steps, currentTab() === 'forecast' && styles.stepsHidden)} ref={(el) => stepsRef = el}>
                  <For each={STEPS}>
                    {(step, index) => (
                      <>
                        <div
                          id={`step-${step.id}`} 
                          class={clsx(
                            styles.step,
                            index() === currentStepIndex() && styles.stepActive,
                            index() < currentStepIndex() && styles.stepCompleted
                          )}
                          onClick={() => index() < currentStepIndex() && setCurrentTab(step.id)}
                        >
                          <span class={styles.stepNumber}>{index() + 1}</span>
                          <span class={styles.stepTitle}>{step.title}</span>
                        </div>
                        <Show when={index() < STEPS.length - 1}>
                          <span class={clsx(
                            styles.stepSeparator,
                            index() < currentStepIndex() && styles.stepSeparatorActive
                          )}>—</span>
                        </Show>
                      </>
                    )}
                  </For>
                </div>
                <Show when={currentTab() === 'forecast'}>
                  <div class={styles.forecastTitle}>
                    Ваш Вопрос
                  </div>
                </Show>
              </div>
            </div>

            {/* Tab content с анимацией перелистывания */}
            <div class={styles.tabContainer}>
              <TabsContent
                tabs={tabs}
                currentTab={currentTab}
                tabsOrder={TABS_ORDER}
              />
            </div>
          </div>
        </div>
        
        <div class={styles.searchContainer}>
            <div class={styles.grid}>
                <div class={clsx(styles.gridItem, styles.firstItem)}>
                    <div class={styles.cube}>
                        <img src="/assets/images/selection.webp" alt="Подбор астролога" class={styles.cubeImage} />
                    </div>
                    <a class={styles.itemLabel}><span>Подбор астролога</span></a>
                </div>
                <div class={clsx(styles.gridItem, styles.secondItem)}>
                    <div class={styles.cube}>
                        <img src="/assets/images/connection.png" alt="Подбор астролога" class={styles.cubeImage} />
                    </div>
                    <a class={styles.itemLabel}><span>Совместимость</span></a>
                </div>
                <div class={clsx(styles.gridItem, styles.thirdItem)}>
                    <div class={styles.cube}>
                        <img src="/assets/images/taro.webp" alt="Карты Таро" class={styles.cubeImage} />
                    </div>
                    <a class={styles.itemLabel}><span>Расклад Таро</span></a>
                </div>
                <div class={clsx(styles.gridItem, styles.fourthItem)}>
                    <div class={styles.cube}>
                        <img src="/assets/images/forum.webp" alt="Форум" class={styles.cubeImage} />
                    </div>
                    <a class={styles.itemLabel}>
                        <span>Форум</span>
                    </a>
                </div>
            </div>
            <div class={styles.searchInputContainer} ref={(el) => containerRef = el}>
                <div 
                  class={styles.searchInputWrapper}
                  onClick={!isAnimating() ? handleInputClick : undefined}
                  ref={(el) => wrapperRef = el}
                >
                    <div class={styles.searchInput} ref={(el) => searchInputRef = el}>
                        <svg class={styles.chatIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 6C21 4.34 19.66 3 18 3H6C4.34 3 3 4.34 3 6V14C3 15.66 4.34 17 6 17H7L7 21L11 17H18C19.66 17 21 15.66 21 14V6Z" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="8.5" cy="10" r="0.8" fill="rgba(255,255,255,0.35)"/>
                            <circle cx="12" cy="10" r="0.8" fill="rgba(255,255,255,0.35)"/>
                            <circle cx="15.5" cy="10" r="0.8" fill="rgba(255,255,255,0.35)"/>
                        </svg>
                        <h1>Бесплатный вопрос натальной карте</h1>
                    </div>
                </div>
            </div>
        </div>
        
        <Modal isOpen={isConfirmModalOpen()} onClose={() => setIsConfirmModalOpen(false)}>
          <div style="display: flex; flex-direction: column; gap: 8px; padding: 16px">
            <h2 style="font-size: 1.5rem; line-height: 1.1; font-weight: 600; color: rgba(255, 255, 255, 0.95); margin: 0;">
              Вы точно хотите закрыть вопрос?
            </h2>
            <p style="font-size: 1rem; color: rgba(255, 255, 255, 0.8); margin: 0; line-height: 1.6;">
              Вы сможете вернуться к вопросу в разделе "Мои прогнозы"
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 0.5rem;">
              <button
                onClick={handleNewQuestion}
                style="width: 100%; padding: 0.75rem 1.5rem; background: var(--color-primary, #ffe433); border: none; border-radius: 12px; font-size: 1rem; font-weight: 600; color: var(--bg-primary, #1a1a1a); cursor: pointer; transition: background 0.2s ease;"
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-hover, #ffd700)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-primary, #ffe433)'}
              >
                Задать новый вопрос
              </button>
              <button
                onClick={handleConfirmClose}
                style="width: 100%; padding: 0.75rem 1.5rem; background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 12px; font-size: 1rem; font-weight: 600; color: rgba(255, 255, 255, 0.9); cursor: pointer; transition: all 0.2s ease;"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                Закрыть
              </button>
            </div>
          </div>
        </Modal>
    </div>
  );
};

export default SearchBar;
