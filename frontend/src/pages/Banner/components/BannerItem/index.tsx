import React, { FC } from 'react';
import { IBannerItem } from '../../../../types/banner.type';
import { imageUrl } from '../../../../utils/constants';
import { useClassName } from '../../../../utils/cn';
import { api } from '../../../../utils/api';
import { Button, Image, notification } from 'antd';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

interface IBannerItemProps {
  banner: IBannerItem;
  changeSearchParam: (key: string, value: string) => void;
  getBanners: () => Promise<void>;
}

const BannerItem: FC<IBannerItemProps> = ({
  banner,
  changeSearchParam,
  getBanners,
}) => {
  const cn = useClassName('banner');

  const deleteBannerAsync = async (id: string) => {
    try {
      const { data } = await api.delete(`/banner/${id}`);
      console.log(data);
      await getBanners();
      notification.success({ message: data?.message });
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    }
  };

  const handleEditBanner = () => {
    changeSearchParam('id', banner._id);
  };

  return (
    <div className={cn('banner-item')}>
      <Image.PreviewGroup
        preview={{
          onChange: (current, prev) =>
            console.log(`current index: ${current}, prev index: ${prev}`),
        }}
      >
        <Image width={200} src={banner.image} />
      </Image.PreviewGroup>

      <div>
        <div>{banner.title}</div>
        <div className={cn('banner-item-buttons')}>
          <Button onClick={handleEditBanner}>Изменить</Button>
          <Button
            type="primary"
            danger
            onClick={() => deleteBannerAsync(banner._id)}
          >
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BannerItem;
