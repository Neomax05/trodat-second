import React, { useContext } from 'react';
import { Button, Form, FormProps, Input, notification } from 'antd';
import { api } from '../../utils/api';
import { Navigate, useNavigate } from 'react-router';
import './style.css';
import useAuthStore from '../../store/auth';
import { AuthResponse } from '../../types/user.type';

type FieldType = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const onLogin = useAuthStore((state) => state.onLogin);
  const isLogin = useAuthStore((state) => state.isLogin);
  const [notApi, contextHolder] = notification.useNotification();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const res = await api.post<AuthResponse>('/auth/sign-in', values);
      console.log(res);

      if (res.data.access_token) {
        onLogin(res.data);
        navigate('/');
      }
    } catch (e: any) {
      notApi.error({
        message: e.message,
      });
    }
  };

  if (isLogin) return <Navigate to="/admin" />;

  return (
    <div className="login-wrapper">
      {contextHolder}
      <Form onFinish={onFinish} className="login-form" autoComplete="off">
        <h1 className="login-title">Логин</h1>
        <Form.Item<FieldType>
          label="Логин"
          name="email"
          rules={[{ required: true, message: 'Введите логин' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3 }}>
          <Button type="primary" htmlType="submit">
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
