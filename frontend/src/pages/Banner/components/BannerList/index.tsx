import React, { FC } from 'react';
import { IBannerItem } from '../../../../types/banner.type';
import BannerItem from '../BannerItem';
import { useClassName } from '../../../../utils/cn';

interface IBannerListProps {
  list: IBannerItem[];
}

const BannerList: FC<IBannerListProps> = ({ list }) => {
  const cn = useClassName('banner');

  return (
    <div className={cn('banner-list')}>
      {list.map((banner) => (
        <BannerItem key={banner._id} banner={banner} />
      ))}
    </div>
  );
};

export default BannerList;
