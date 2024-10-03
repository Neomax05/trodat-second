import React from 'react';
import { Outlet } from 'react-router';
import { useClassName } from '../../utils/cn';
import Sidebar from '../Sidebar';
import { Layout as AntdLayout } from 'antd';
import './style.scss';

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#fff',
};

const layoutStyle = {
  borderRadius: 8,
};

const Layout = () => {
  const cn = useClassName('layout');

  return (
    <AntdLayout className={cn()} style={layoutStyle}>
      <AntdLayout.Sider width="20%" style={siderStyle}>
        <Sidebar />
      </AntdLayout.Sider>
      <AntdLayout className={cn('outlet-wrapper')}>
        <AntdLayout.Content>
          <Outlet />
        </AntdLayout.Content>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
