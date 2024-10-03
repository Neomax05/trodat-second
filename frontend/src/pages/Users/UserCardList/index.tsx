import React from 'react';
import { Row, Col } from 'antd';
import UserCardItem from '../UserCardItem';

interface User {
  _id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
  avatar?: string;
}

interface UserCardListProps {
  users: User[];
}

const UserCardList: React.FC<UserCardListProps> = ({ users }) => {
  return (
    <Row gutter={[16, 16]} className="user-card-list">
      {users.map((user, index) => (
        <Col key={user._id} xs={24} sm={12} md={8} lg={8}>
          <UserCardItem
            email={user.email}
            fullName={user.full_name}
            phoneNumber={user.phone_number}
            role={user.role}
            avatar={user.avatar}
          />
        </Col>
      ))}
    </Row>
  );
};

export default UserCardList;
