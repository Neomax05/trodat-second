import React from 'react';
import { Menu, MenuProps } from 'antd';
import {
  ProductOutlined,
  SnippetsOutlined,
  UnorderedListOutlined,
  BoxPlotOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeKey = location.pathname.split('/')[1] || '';

  const menuList: MenuProps['items'] = [
    {
      icon: React.createElement(ProductOutlined),
      key: 'product',
      label: 'Товары',
      onClick: () => navigate('product'),
    },
    {
      icon: React.createElement(UnorderedListOutlined),
      key: 'category',
      label: 'Категории',
      onClick: () => navigate('category'),
    },
    {
      icon: React.createElement(SnippetsOutlined),
      key: 'news',
      label: 'Новости',
      onClick: () => navigate('news'),
    },
    {
      icon: React.createElement(BoxPlotOutlined),
      key: 'banner',
      label: 'Банер',
      onClick: () => navigate('banner'),
    },
    {
      icon: React.createElement(UsergroupAddOutlined),
      key: 'order',
      label: 'Заказы',
      onClick: () => navigate('order'),
    },
    {
      icon: React.createElement(UsergroupAddOutlined),
      key: 'users',
      label: 'Пользователь',
      onClick: () => navigate('users'),
    },
  ];

  return (
    <div style={{}}>
      <h2 style={{ textAlign: 'center', margin: 0 }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#444' }}>
          Trodat
        </Link>
      </h2>
      <Menu
        mode="inline"
        selectedKeys={[activeKey]}
        style={{ height: '85%', borderRight: 'none', textAlign: 'left' }}
        items={menuList}
      />

      <LogoutButton />
    </div>
  );
};

export default Sidebar;
