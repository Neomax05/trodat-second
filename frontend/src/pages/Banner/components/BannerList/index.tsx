import React, { FC } from 'react';
import { IBannerItem } from '../../../../types/banner.type';
import BannerItem from '../BannerItem';
import { useClassName } from '../../../../utils/cn';
import { useSearchParams } from 'react-router-dom';

interface IBannerListProps {
  list: IBannerItem[];
  getBanners: () => Promise<void>;
}

const BannerList: FC<IBannerListProps> = ({ list, getBanners }) => {
  const cn = useClassName('banner');
  const [, setSearchParams] = useSearchParams();

  const changeSearchParam = (key: string, value: string) => {
    setSearchParams({ [key]: value });
  };

  return (
    <div className={cn('banner-list')}>
      {list.map((banner) => (
        <BannerItem
          key={banner._id}
          banner={banner}
          changeSearchParam={changeSearchParam}
          getBanners={getBanners}
        />
      ))}
    </div>
  );
};

export default BannerList;
