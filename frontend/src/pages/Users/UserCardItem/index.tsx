import React from 'react';
import { Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface UserCardItemProps {
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  avatar?: string;
}

const UserCardItem: React.FC<UserCardItemProps> = ({
  email,
  fullName,
  phoneNumber,
  role,
  avatar,
}) => {
  return (
    <Card className="user-card-item" hoverable>
      <Card.Meta
        avatar={<Avatar src={avatar || <UserOutlined />} />}
        title={fullName}
        description={
          <div className="card-details">
            <p>Email: {email}</p>
            <p>Phone: {phoneNumber}</p>
            <p>Role: {role}</p>
          </div>
        }
      />
    </Card>
  );
};

export default UserCardItem;
