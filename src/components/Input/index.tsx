import React, { FC, InputHTMLAttributes, ComponentType, useEffect, useRef, useState, useCallback } from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  name: string;
  icon: ComponentType<IconBaseProps>;
}

const Input: FC<InputProps> = ({ name, icon: Icon, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocuses, setIsFocuses] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const {fieldName, defaultValue, error, registerField} = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value'
    })
  }, [fieldName, registerField]);

  const handleInputFocus = useCallback(() => {
    setIsFocuses(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocuses(false);
    setIsFilled(!!inputRef.current?.value);
  }, [])

  return (
    <Container isErrored={!!error} isFilled={isFilled} isFocuses={isFocuses}>
      { Icon && <Icon size={20} /> }
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        type="text"
        {...rest}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>)}
    </Container>
  );
};

export default Input;
