import { FC, useCallback, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Keyboard } from '@capacitor/keyboard';
import './styles.scss';

interface IProps {
  value: string;
  placeholder?: string;
  isError?: boolean;
  textError?:string;
  toolbar?: any;
  onChange: (value: any) => void;
}

const Quill: FC<IProps> = ({ value, onChange, placeholder, isError, textError, toolbar }) => {
  const isFocused = useRef<boolean>(false);

  const onFocus = useCallback(() => {
    isFocused.current = true;
  }, []);

  const onBlur = useCallback(() => {
    isFocused.current = false;
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      if (isFocused.current) {
        // window.scrollTo(0, document.body.scrollHeight);
      }
    });

    return () => {
      Keyboard.removeAllListeners();
    };
  }, []);

  const onChangeText = useCallback((value: string) => {
    if (onChange) {
      onChange(value);
    }
  }, [onChange]);
  
  return (
    <div className="quill-conatiner">
      {
        isError && (
          <div className="quil-error-message">
            {textError}
          </div>
        )
      }
      <ReactQuill
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        onChange={onChangeText}
        placeholder={placeholder}
        theme="snow"
        modules={{
          toolbar: [
            toolbar ? [...toolbar] : ['bold', 'italic', 'underline', 'strike', { 'list': 'bullet' }]
          ],
          clipboard: {
            matchVisual: false
          }
        }}
      />
    </div>
  );
};

export default Quill;
