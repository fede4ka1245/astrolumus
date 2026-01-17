import { Tooltip, Grid } from '@mui/material';
import { FC, useState, useEffect, useRef, useCallback } from 'react';

interface IProps {
  title: string,
  isDark?: boolean
}

const QuestionButton: FC<IProps> = ({ title, isDark = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<any>(null);

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleOutsideClick = useCallback((event: Event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  if (isDark) {
    return (
      <Tooltip style={{ display: 'flex', alignItems: 'center' }} ref={tooltipRef} title={<Grid maxWidth={200}>{title}</Grid>} arrow open={isOpen} onClick={handleClick} placement="top">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="18" height="18" rx="9" fill="#C4C4C4" stroke="#C3C9CD" strokeWidth="2"></rect><path d="M7.5 6.66667C7.5 6.66667 8.33333 5 10 5C11.6667 5 12.2594 5.91974 12.5 6.66667C13.0634 8.41562 11.25 9.58333 11.25 9.58333C11.25 9.58333 10 10.6607 10 11.25C10 11.6667 10 12.0833 10 12.0833" stroke="#282363" strokeWidth="2" strokeLinecap="round"></path><circle cx="10.0007" cy="14.7917" r="1.04167" fill="#282363"></circle></svg>
      </Tooltip>
    );
  }

  return (
    <Tooltip ref={tooltipRef} title={<Grid maxWidth={200}>{title}</Grid>} arrow open={isOpen} onClick={handleClick} placement="top">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="18" height="18" rx="9" fill="#37366B" stroke="#37366B" strokeWidth="2"/>
        <path d="M7.5 6.66667C7.5 6.66667 8.33333 5 10 5C11.6667 5 12.2594 5.91974 12.5 6.66667C13.0634 8.41562 11.25 9.58333 11.25 9.58333C11.25 9.58333 10 10.6607 10 11.25C10 11.6667 10 12.0833 10 12.0833" stroke="#E5E5E5" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="10.0002" cy="14.7917" r="1.04167" fill="#E5E5E5"/>
      </svg>
    </Tooltip>
  );
};

export default QuestionButton;
