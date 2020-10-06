import React, { FC, useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import getValidationErros from '../../utils/getValidationsErrors'
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';
import api from '../../services/api';

import { Container, Content, AnimarionContainer, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

import logo from '../../assets/logo.svg';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      await signIn({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      if(error instanceof Yup.ValidationError){
        const errors = getValidationErros(error)
        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na autenticação',
        description: 'Ocorreu um erro ao fazer login, cheque as credenciais',
      });
    }
  }, [signIn, addToast]);

  return (
    <Container>
      <Content>
        <AnimarionContainer>
          <img src={logo} alt="GoBarber"/>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Logon</h1>

            <Input name="email" placeholder="E-mail" icon={FiMail} />
            <Input type="password" name="password" placeholder="Senha" icon={FiLock} />
            <Button type="submit">Entrar</Button>
            <Link to="forgot-password">Esqueci minha senha</Link>
          </Form>
          <Link to="signup"><FiLogIn size={20} /> Criar conta</Link>
        </AnimarionContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
