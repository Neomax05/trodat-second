import { Avatar, Card, Descriptions } from 'antd';
import React, { FC } from 'react';
import { AuthResponse } from '../../../types/user.type';

interface ICardItemProps {
  user: AuthResponse;
  totalAmount: number;
}

const CardItem: FC<ICardItemProps> = ({ user, totalAmount }) => {
  return (
    <Card className="user-card" title="Информация о заказе" bordered={false}>
      <Descriptions title="Информация о пользователе" bordered>
        <Descriptions.Item label="Полное имя">
          {user.full_name}
        </Descriptions.Item>
        <Descriptions.Item label="Электронная почта">
          {user.email}
        </Descriptions.Item>
        <Descriptions.Item label="Телефон">
          {user.phone_number}
        </Descriptions.Item>
      </Descriptions>
      <Avatar src={user.avatar} size={64} />
      <div className="total-amount">Общая сумма: ${totalAmount}</div>
    </Card>
  );
};

export default CardItem;
