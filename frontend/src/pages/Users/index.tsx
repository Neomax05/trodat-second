import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import UserCardList from './UserCardList';
import './index.scss';

const Users = () => {
  const [users, setOrders] = useState([]);

  const getOrdersAsync = async () => {
    try {
      const { data } = await api.get('/users/all');
      console.log(data);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrdersAsync();
  }, []);

  return (
    <div>
      <h1>Список пользователей</h1>
      <UserCardList users={users} />
    </div>
  );
};

export default Users;
