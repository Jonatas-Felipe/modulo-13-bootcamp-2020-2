import React, { FC, useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import getValidationErros from '../../utils/getValidationsErrors'
import api from '../../services/api';
import { useToast } from '../../hooks/Toast'

import { Container, Content, AnimarionContainer, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';


import logo from '../../assets/logo.svg';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { addToast } = useToast();
  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'No minino 6 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      await api.post('users', data);

      history.push('/');

      addToast({
        type: "success",
        title: "Cadastro realizado!",
        description: "Você já pode fazer seu logon no GoBarber!"
      });

    } catch (error) {
      const errors = getValidationErros(error)
      formRef.current?.setErrors(errors);

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
  }, [addToast, history])

  return (
    <Container>
      <Background />
      <Content>
        <AnimarionContainer>
          <img src={logo} alt="GoBarber"/>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>

            <Input name="name" placeholder="Name" icon={FiUser} />
            <Input name="email" placeholder="E-mail" icon={FiMail} />
            <Input type="password" name="password" placeholder="Senha" icon={FiLock} />
            <Button type="submit">Entrar</Button>
          </Form>
          <Link to="/"><FiArrowLeft size={20} /> Cadastrar</Link>
        </AnimarionContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
