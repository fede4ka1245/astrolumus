// images
import teacher1 from './images/teachers/teacher_1.png';
import teacher2 from './images/teachers/teacher_2.png';
import teacher3 from './images/teachers/teacher_3.png';
import program1 from './images/miniCourse/01.png';
import program2 from './images/miniCourse/02.png';
import program3 from './images/miniCourse/03.png';
import program4 from './images/miniCourse/04.png';
import program5 from './images/miniCourse/05.png';
import program6 from './images/miniCourse/06.png';
import certificate from './images/certificate.png';
import sunImage from './images/payment/sun.png';
import neptune from './images/payment/neptune.png';

export const list = [
  {
    id: 1,
    title: 'Формат',
    description: '24 видео урока и 12 онлайн-практикумов',
    show: true,
    order: 1,
    course: 1
  },
  {
    id: 2,
    title: 'Проверка',
    description: '22 теста и большое финальное тестирование',
    show: true,
    order: 1,
    course: 1
  },
  {
    id: 3,
    title: 'Вы — часть школы',
    description: 'Ваша страница-визитка на сайте Школы',
    show: true,
    order: 1,
    course: 1
  },
  {
    id: 3,
    title: 'Документы',
    description: 'Сертификат школы с личным ID',
    show: true,
    order: 1,
    course: 1
  }
];

export const masterClassList = [
  {
    id: 1,
    title: 'Старт МК',
    description: '22 ноября, 6 месяцев',
    show: true,
    order: 1,
    course: 1
  },
  {
    id: 2,
    title: 'Формат',
    description: 'Студийная видеозапись',
    show: true,
    order: 1,
    course: 1
  },
  {
    id: 3,
    title: 'Доступ к видеозаписи',
    description: '1 год',
    show: true,
    order: 1,
    course: 1
  },
  {
    id: 3,
    title: 'Ведущая МК',
    description: 'Елена Карпинчик',
    show: true,
    order: 1,
    course: 1
  }
];

export const miniCourselist = [
  {
    id: 1,
    title: 'Формат',
    description: '6 уроков в записи. Full HD - студийное качество',
    show: true,
    order: 1,
    course: 1
  },
  {
    id: 2,
    title: 'Проверка',
    description: '1 онлайн-практикум с Татьяной Калининой',
    show: true,
    order: 1,
    course: 1
  },
  {
    id: 3,
    title: 'Поддержка',
    description: 'На любые ваши вопросы ответит куратор курса',
    show: true,
    order: 1,
    course: 1
  },
  {
    id: 3,
    title: 'Чат',
    description: 'Общение с педагогами и учениками в чате школы',
    show: true,
    order: 1,
    course: 1
  }
];

export const sliderList = [
  {
    id: 1,
    order: 1,
    title: 'ДЛЯ ТЕХ, КТО',
    description: 'нет познаний в астрологии, кто учился сам или в других школах, но не получил системных знаний.',
    show: true,
    course: 1
  },
  {
    id: 2,
    order: 2,
    title: 'ДЛЯ ТЕХ, КТО',
    description: 'интересны прогнозы, кто ищет рабочие техники, хочет систематизировать знания и начать применять на себе или клиентах.',
    show: true,
    course: 2
  },
  {
    id: 3,
    order: 2,
    title: 'ДЛЯ ТЕХ, КТО',
    description: 'хочет получить быстрый и мощный старт в работе астролога. Кто не боится потока знаний и готов узнать много.',
    show: true,
    course: 2
  }
];

export const teachers = [
  {
    first_name: 'Татьяна',
    last_name: 'Калинина',
    avatar: teacher3,
    teacher_title: 'Основатель школы Альфа и проекта Deep Sky Strology',
    teacher_description: 'Руководитель школы Альфа. Известный астролог, исследователь и педагог. Автор многих успешных публичных прогнозов для президентов, политиков, стран и выдающихся людей.',
    shadow: '#00EABD'
  },
  {
    first_name: 'Елена',
    last_name: 'Карпинчик',
    avatar: teacher1,
    teacher_title: 'Ведущая живых онлайн-практикумов, куратор курса',
    teacher_description: 'Практикующий джйотиш-астролог, одна из самых сильных учениц Татьяны Калининой. Специалист в сфере прогнозов.',
    shadow: '#DD08CB'
  },
  {
    first_name: 'Александра',
    last_name: 'Ващилко',
    avatar: teacher2,
    teacher_title: 'Ведущая живых онлайн-практикумов, куратор курса',
    teacher_description: 'Практикующий джйотиш-астролог, одна из самых сильных учениц Татьяны Калининой. Специалист в сфере прогнозов и ректификации.',
    shadow: '#F2D113'
  }
];

export const withinCourses = [
  {
    description: 'Соберете в стройную систему свои знания из других школ или самостоятельного изучения.'
  },
  {
    description: 'Получите основы прогнозирования по натальной карте.'
  },
  {
    description: 'Изучите гороскоп вопроса, который поможет вам делать успешные прогнозы уже через 10 уроков, а не через 3 года.'
  },
  {
    description: 'Адаптируетесь в Джйотиш, если вы учились в Западной традиции.'
  },
  {
    description: 'Освоите дополнительные техники прогнозов, компенсирующие отсутствие большого опыта в прогнозах.'
  },
  {
    description: 'После курса вы можете смело начать работать астрологом, мы вас подготовим.'
  }
];

export const modules = [
  {
    id: 1,
    lessons: [
      {
        id: 1,
        title: 'Урок 1',
        description: 'Планеты, их функции и знаки Зодиака. Введение в Джйотиш.',
        module: 1,
        order: 1,
        updated: '2022-12-12',
        created: '2022-12-12',
        publish_date: '2022-12-12',
        course: 1
      },
      {
        id: 2,
        title: 'Урок 2',
        description: 'Планеты, их функции и знаки Зодиака. Введение в Джйотиш.',
        module: 1,
        order: 1,
        updated: '2022-12-12',
        created: '2022-12-12',
        publish_date: '2022-12-12',
        course: 1
      }
    ],
    lessons_count: 2,
    title: 'Модуль 1',
    description: 'Механика гороскопа',
    order: 1,
    updated: '2022-12-12',
    created: '2022-12-12',
    publish_date: '2022-12-12',
    course: 1
  }
];

export const nominalCertificate = {
  description: 'После обучения вы защитите теоретический и практический экзамены перед комиссией и получите сертификат школы Альфа.',
  image: certificate

};

export const miniCourseWhatYouBuys = [
  {
    id: 1,
    description: 'Получите базовые знания по устройству Солнечной системы. Узнаете какой характер и функции у планет.',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 2,
    description: 'Установите и настроите программу для работы.',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 3,
    description: 'Получите знания по соединению планет.',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 4,
    description: 'Познакомитесь с Джйотиш гороскопом',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 5,
    description: 'Научитесь давать трактовку на уровне планета в знаке зодиака и планета в доме. Поймёте насколько комфортно той или иной планете в доме и знаке.',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 6,
    description: 'Познакомитесь с основами прогностики и посмотрите как сделать первые прогнозы.',
    order: 1,
    show: true,
    course: 1
  }
];

export const whatYouBuys = [
  {
    id: 1,
    description: 'Старт потока - 26.05.2022г.',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 2,
    description: 'Длительность всего обучения 4 месяца..',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 3,
    description: '22 основных уроков. Формат - видеозапись..',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 4,
    description: '11 онлайн-практикумов с кураторами курса + запись практикума в личном кабинете.',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 5,
    description: '2 основных урока в записи для самостоятельного изучения + практикум с отработкой по пройденному материалу каждые 10 дней..',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 6,
    description: 'Возможность задавать свои вопросы в течение всего времени обучения на курсе.',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 7,
    description: 'Добавление в чат Telegram для общения и обмена опытом (чат очень активный!).',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 8,
    description: 'Экзаменационное тестирование..',
    order: 1,
    show: true,
    course: 1
  },
  {
    id: 7,
    description: 'Именной сертификат с уникальным идентификационным номером, опубликованный на нашем сайте в виде личной странички астролога.',
    order: 9,
    show: true,
    course: 1
  }
];

export const miniCourseInfo = [
  {
    text: 'За 6 уроков курса мы проведем вас от элементарных представлений об астрологии к первым трактовкам своей судьбы.'
  },
  {
    text: 'Интересные примеры, видео и интерактивная подача материала поможет вам легко и быстро запомнить, что где в вашем гороскопе.'
  },
  {
    text: 'Мы собрали весь свой огромный опыт и мастерство в простые формулировки, которые сделают ваше обучение астрологии простым и приятным.'
  }
];

export const courseInfo = [
  {
    text: 'Соберете в стройную систему свои знания из других школ или самостоятельного изучения.'
  },
  {
    text: 'Получите основы прогнозирования по натальной карте.'
  },
  {
    text: 'Изучите гороскоп вопроса, который поможет вам делать успешные прогнозы уже через 10 уроков, а не через 3 года.'
  },
  {
    text: 'Адаптируетесь в Джйотиш, если вы учились в Западной традиции.'
  },
  {
    text: 'Освоите дополнительные техники прогнозов, компенсирующие отсутствие большого опыта в прогнозах.'
  },
  {
    text: 'После курса вы можете смело начать работать астрологом, мы вас подготовим.'
  }
];

export const cosmoCountList = [
  'Получите базовые знания по устройству Солнечной системы. Узнаете какой характер и функции у планет.',
  'Установите и настроите программу для работы.',
  'Получите знания по соединению планет.',
  'Познакомитесь с Джйотиш гороскопом',
  'Научитесь давать трактовку на уровне планета в знаке зодиака и планета в доме. Поймёте насколько комфортно той или иной планете в доме и знаке.',
  'Познакомитесь с основами прогностики и посмотрите как сделать первые прогнозы.'
];

export const programs = [
  {
    title: 'Вводная часть в астрологию',
    image: program1,
    description: 'Строение солнечной системы. Зодиакальные созвездия и неподвижные звезды. Понятие Deep Sky астрологии. Планеты и сферы за которые они отвечают. Какой характер и функции у планет? Обозначения планет в гороскопе.'
  },
  {
    title: 'Настройка программы для работы',
    image: program2,
    description: 'Установка и настройка программы для работы астролога. Построение гороскопа.'
  },
  {
    title: 'Планеты в знаках зодиака',
    image: program3,
    description: 'Вид гороскопа. Последовательность знаков Зодиака. Знаки зодиака и их управители. Стихии знаков. Как трактовать гороскоп на уровне планета в знаке зодиака? Понятие комфорта планеты в знаке.'
  },
  {
    title: 'Планеты в домах гороскопа',
    image: program4,
    description: 'Дома гороскопа. Понятие Лагны и распределение знаков зодиака по домам. Как трактовать планету в доме? Комфортно ли планете в этом доме и знаке?'
  },
  {
    title: 'Вводная часть в астрологию',
    image: program5,
    description: 'Строение солнечной системы. Зодиакальные созвездия и неподвижные звезды. Понятие Deep Sky астрологии. Планеты и сферы за которые они отвечают. Какой характер и функции у планет? Обозначения планет в гороскопе.'
  },
  {
    title: 'Соединения планет',
    image: program6,
    description: 'Соединения планет. Как энергии планет смешивается между собой и дают характер? Понятия соединений (соединения с Марсом, Венерой, Солнцем и тд).'
  }
];

export const payInFull = {
  title: 'Оплатить полностью',
  image: sunImage,
  list: [],
  bonus_list: [
    {
      description: 'Мастер-класс по определению времени замужества',
      show: true,
      disabled: true
    },
    {
      description: 'Углубленный урок по прогнозам Чара Даша Джаймини.',
      show: true,
      disabled: true
    }
  ],
  description: 'Оплата производится в один этап с фиксированной стоимостью',
  full_price: 47400,
  payment_title: '',
  discount_price: 46900,
  monthly_fee: {
    show: false,
    quantity: '',
    price: 0,
    title: ''
  } 
};

export const freePayment = {
  title: 'Запись на Мастер-класс',
  image: sunImage,
  list: [],
  bonus_list: [],
  description: '21 ноября в 19:00 МСК. Онлайн участие',
  full_price: 0,
  payment_title: '',
  discount_price: 0,
  subtitle: 'Участие бесплатно',
  button_text: 'Бесплатно',
  monthly_fee: {
    show: false,
    quantity: '',
    price: 0,
    title: ''
  } 
};

export const payVip = {
  title: 'VIP',
  image: sunImage,
  list: [
    {
      show: true,
      description: '10 основных уроков в видеозаписи'
    },
    {
      show: true,
      description: '5 практикумов с куратором в записи, где группа отрабатывает материал данный на уроке.'
    },
    {
      show: true,
      description: 'Презентации к урокам.'
    },
    {
      show: true,
      description: 'Возможность задавать вопросы по обучению куратору курса в течение 3 месяцев на учебной платформе.'
    },
    {
      show: true,
      description: 'Добавление в информационный чат Telegram.'
    },
    {
      show: true,
      description: 'Экзамен и проверка.'
    },
    {
      show: true,
      description: 'Сертификат.'
    },
    {
      show: true,
      description: 'Запись VIP вебинара для практической работы астрологом.'
    }
  ],
  bonus_list: [],
  description: '',
  full_price: 47400,
  payment_title: '',
  discount_price: 46900,
  monthly_fee: {
    show: false,
    quantity: '',
    price: 0,
    title: ''
  } 
};

export const payInMonth = {
  title: 'Оплачивать помесячно',
  image: neptune,
  list: [],
  bonus_list: [
    {
      description: 'Мастер-класс по определению времени замужества',
      show: true,
      disabled: true
    },
    {
      description: 'Углубленный урок по прогнозам Чара Даша Джаймини.',
      show: true,
      disabled: true
    }
  ],
  description: '',
  full_price: 51700,
  discount_price: 0,
  payment_title: '',
  monthly_fee: {
    show: true,
    quantity: '5 платежей',
    price: 10340,
    title: 'Оплата один раз в месяц'
  } 
};

export const optimal = {
  title: 'Оптимальный',
  image: neptune,
  list: [
    {
      show: true,
      description: '10 основных уроков в видеозаписи'
    },
    {
      show: true,
      description: '5 практикумов с куратором в записи, где группа отрабатывает материал данный на уроке.'
    },
    {
      show: true,
      description: 'Презентации к урокам.'
    },
    {
      show: true,
      description: 'Возможность задавать вопросы по обучению куратору курса в течение 3 месяцев на учебной платформе.'
    },
    {
      show: true,
      description: 'Добавление в информационный чат Telegram.'
    },
    {
      show: true,
      description: 'Экзамен и проверка.'
    },
    {
      show: true,
      description: 'Сертификат.'
    },
    {
      show: true,
      description: 'Запись VIP вебинара для практической работы астрологом.'
    }
  ],
  bonus_list: [],
  description: '',
  full_price: 21400,
  payment_title: '',
  discount_price: 0,
  monthly_fee: {
    show: true,
    quantity: '5 платежей',
    price: 10340,
    title: 'Оплата один раз в месяц'
  } 
};

export const mainTeacher = {
  first_name: 'Елена',
  last_name: 'Карпинчик',
  avatar: teacher1,
  teacher_title: 'Ведущая живых онлайн-практикумов, куратор курса',
  teacher_description: 'Практикующий джйотиш-астролог, одна из самых сильных учениц Татьяны Калининой. Специалист в сфере прогнозов.',
  shadow: '#DD08CB'
};
