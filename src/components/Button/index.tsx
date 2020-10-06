import React, { FC,ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" { ...rest }>{loading ? 'Carregando...' : children }</Container>
);

export default Button;
