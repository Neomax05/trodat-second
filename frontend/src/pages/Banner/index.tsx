import React, { useEffect, useState } from 'react';
import './style.scss';
import { useClassName } from '../../utils/cn';
import { Button } from 'antd';
import CreateBannerModal from './components/CreateBannerModal';
import { api } from '../../utils/api';
import BannerList from './components/BannerList';

const BannerPage = () => {
  const cn = useClassName('banner');
  const [modal, setModal] = useState(false);
  const [banners, setBanners] = useState([]);

  const handleCreateNews = async (imageFile: File | null) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    try {
      await api.post('/banner', formData);
    } catch (err) {
      alert(err);
    } finally {
      setModal(false);
    }
  };

  const getBanners = async () => {
    try {
      const { data } = await api.get('/banner');
      setBanners(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  console.log(banners, 'banner');

  return (
    <div className={cn('banner')}>
      <div className={cn('header')}>
        <h1>Банер</h1>
        <Button onClick={() => setModal(true)}>Создать банер</Button>
      </div>

      <CreateBannerModal
        open={modal}
        setOpen={setModal}
        handleOk={handleCreateNews}
        confirmLoading={false}
        handleCancel={() => setModal(false)}
      />

      <BannerList list={banners} />
    </div>
  );
};

export default BannerPage;
