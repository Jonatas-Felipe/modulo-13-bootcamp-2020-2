import React, { ChangeEvent, FC, useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock, FiCamera } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import getValidationErros from '../../utils/getValidationsErrors'
import api from '../../services/api';
import { useToast } from '../../hooks/Toast'

import { Container, Content, AvatarInput, Img } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/Auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const handleSubmit = useCallback(async (data: ProfileFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().min(6, 'No minino 6 dígitos')
        }),
        password_confirmation: Yup.string().oneOf([Yup.ref('password')], 'Confirmação incorreta'),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      const { name, email, old_password, password, password_confirmation } = data;

      const formData = Object.assign({
        name,
        email,
      }, old_password && {
        old_password,
        password,
        password_confirmation,
      });

      const response = await api.put('profile', formData);

      updateUser(response.data);

      history.push('/dashboard');

      addToast({
        type: "success",
        title: "Perfil atualizado!",
        description: "Suas informações do perfil foram atualizadas com sucesso!"
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
  }, [addToast, history]);

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
      const data = new FormData();
      data.append('avatar', e.target.files[0]);

      api.patch('users/avatar', data).then(response => {
        updateUser(response.data);
        addToast({
          type: 'success',
          title: 'Avatar atualizado!',
        })
      });
    }
  }, [addToast])

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <Img src={user.avatar_url} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu Perfil</h1>

          <Input name="name" placeholder="Name" icon={FiUser} />
          <Input name="email" placeholder="E-mail" icon={FiMail} />
          <Input type="password" name="old_password" placeholder="Senha Atual" icon={FiLock} />
          <Input type="password" name="password" placeholder="Nova senha" icon={FiLock} />
          <Input type="password" name="password_confirmation" placeholder="Confirmar senha" icon={FiLock} />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
