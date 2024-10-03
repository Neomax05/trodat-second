import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import './index.scss';
import CardList from './CardList';

const Order = () => {
  const [orders, setOrders] = useState([]);

  const getOrdersAsync = async () => {
    try {
      const { data } = await api.get('/orders/all');
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
    <div className="order-container">
      <CardList list={orders} />
    </div>
  );
};

export default Order;
