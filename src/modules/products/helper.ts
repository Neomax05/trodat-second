import axios from 'axios';

export const productRusFieldToEng = {
  Цвет: 'color',
  Корпус: 'frame',
  'Геометрия оттиска': 'geometry',
  Комплектация: 'equipment',
};

export type ParsedOptionsType = {
  color?: string;
  frame?: string;
  geometry?: string;
  equipment?: string;
};

export const getGoodsFrom1C = async () => {
  const body = {
    auth: {
      clientID: '3bf3de8f-f93a-11ed-810f-005056b73475',
    },
    general: {
      method: 'goods-get',
      deviceID: 'af938540-3071-cc4f-89c9-3d47163a5a3c',
    },
  };

  try {
    const { data } = await axios.post(
      'http://95.215.244.110/edo/hs/ext_api/execute',
      body,
      {
        headers: {
          Authorization: 'Basic QVVUSF9UT0tFTjpqVTVndWphcw==',
          'Content-Type': 'application/json',
          configName: 'yourConfigName',
          configVersion: 'yourConfigVersion',
        },
      },
    );

    const goods = data?.result?.goods || [];

    return goods;
  } catch (error) {
    console.log(error);
  }
};
