import React, { FC, useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { useHistory, useParams } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import getValidationErros from '../../utils/getValidationsErrors'
import { useToast } from '../../hooks/Toast';
import api from '../../services/api';

import { Container, Content, AnimarionContainer, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

import logo from '../../assets/logo.svg';

interface ResetPasswordFormData {
  token: string;
  password: string;
  password_confirmation: string;
}

const ResetPassword: FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const params = useParams<{token: string}>();

  const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        password: Yup.string().min(6, 'No minino 6 dígitos'),
        password_confirmation: Yup.string().oneOf([Yup.ref('password')], 'Confirmação incorreta'),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      const { password, password_confirmation } = data;
      const { token } = params;

      if(!token) {
        throw new Error();
      }

      await api.post(`password/reset/${token}`, {
        password,
        password_confirmation
      })

      history.push('/')

    } catch (error) {
      if(error instanceof Yup.ValidationError){
        const errors = getValidationErros(error)
        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao resetar senha',
        description: 'Ocorreu um erro ao resetar sua senha',
      });
    }
  }, [addToast]);

  return (
    <Container>
      <Content>
        <AnimarionContainer>
          <img src={logo} alt="GoBarber"/>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input type="password" name="password" placeholder="Nova senha" icon={FiLock} />
            <Input type="password" name="password_confirmation" placeholder="Confirmação da senha" icon={FiLock} />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimarionContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
