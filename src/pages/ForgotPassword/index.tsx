import React, { FC, useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
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

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido')
      });

      await schema.validate(data, {
        abortEarly: false
      });

      await api.post('password/forgot', {
        email: data.email
      });

      addToast({
        type: 'success',
        title: 'E-mail de recuperação enviado',
        description: 'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada',
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
        description: 'Ocorreu um erro tentar realizar a recupação de senha',
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return (
    <Container>
      <Content>
        <AnimarionContainer>
          <img src={logo} alt="GoBarber"/>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input name="email" placeholder="E-mail" icon={FiMail} />
            <Button loading={loading} type="submit">Recuperar</Button>
          </Form>
          <Link to="/"><FiLogIn size={20} /> Voltar ao login</Link>
        </AnimarionContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
