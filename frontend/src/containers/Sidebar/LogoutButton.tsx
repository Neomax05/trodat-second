import { Button, Flex, Modal } from 'antd';
import React, { useState } from 'react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/auth';

const LogoutButton = () => {
  const [modal2Open, setModal2Open] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const handleLogoutAsync = async () => {
    try {
      const { data } = await api.post('/auth/logout');
      console.log(data);
      logout();
      setModal2Open(false);
      toast.success('Successfully logout');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ paddingLeft: '24px', paddingRight: '24px' }}>
      <Button type="primary" danger block onClick={() => setModal2Open(true)}>
        Выйти
      </Button>
      <Modal
        title=""
        centered
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
        footer={[
          <Flex vertical gap="small">
            <Button type="default" danger block onClick={handleLogoutAsync}>
              Удалить
            </Button>
            <Button
              type="primary"
              danger
              block
              onClick={() => setModal2Open(false)}
            >
              Отмена
            </Button>
          </Flex>,
        ]}
      >
        <h2 style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
          Вы уверены, что хотите удалить аккаунт?
        </h2>
      </Modal>
    </div>
  );
};

export default LogoutButton;
