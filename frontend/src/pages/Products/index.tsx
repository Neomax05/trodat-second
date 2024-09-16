import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useClassName} from "../../utils/cn";
import {Button, Space, Table, TableProps} from "antd";
import {api} from "../../utils/api";
import {ProductType} from "../../types/product.type";
import {CategoryType} from "../../types/Category.type";
import './style.scss';
import ChangeCategoryModal from "./components/ChangeCategoryModal";

const Products = () => {
  const cn = useClassName('products');
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [changeCategory, setChangeCategory] = useState<null | ProductType>(null);
  const productRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const layout = document.querySelector('.layout__outlet-wrapper');
    if (layout && productRef.current) {
      console.log('here');
      productRef.current.style.width = `${layout.clientWidth - 40}px`;
    }
  }, []);

  const columns: TableProps<ProductType>['columns'] = [
    {
      title: 'Артикул',
      dataIndex: 'article',
      key: 'article',
      width: 100,
      render: (text) => <Button type="link">{text}</Button>,
      align: 'center'
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      width: 400,
      render: (text) => <Button type="link">{text}</Button>,
      align: 'center'
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: CategoryType) => category.name,
      align: 'center'
    },
    {
      title: 'Цвета',
      dataIndex: 'color',
      key: 'color',
      width: 200,
      render: (colors: string[]) => {
        return colors.join(', ');
      },
      align: 'center'
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      // ellipsis: true,
      width: 500,
      className: cn('description-column'),
      align: 'center'
    },
    {
      title: 'Комплектация',
      dataIndex: 'equipment',
      key: 'equipment',
      width: 120,
      align: 'center'
    },
    {
      title: 'Корпус',
      dataIndex: 'frame',
      key: 'frame',
      width: 120,
      align: 'center'
    },
    {
      title: 'Геометрия оттиска',
      dataIndex: 'geometry',
      key: 'geometry',
      align: 'center'
    },
    {
      title: 'Размер клише',
      dataIndex: 'size',
      key: 'size',
      align: 'center'
    },
    {
      title: 'Действие',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => setChangeCategory(record)}>Изменить категорию</Button>
          <Button type="link">Удалить</Button>
        </Space>
      ),
      align: 'center'
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get<ProductType[]>('/products');
        setProducts(res.data);
        setLoading(false);
      } catch (e) {
        alert(e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangeCategory = async (categoryId: string, productId: string) => {
    setLoading(true);
    api.put<ProductType>('/products/changeCategory', {
      categoryId,
      productId
    })
      .then(res => {
        setChangeCategory(null);
        const copyProducts = [...products];
        const index = copyProducts.findIndex(product => product._id === productId);
        copyProducts[index] = res.data;
        setProducts(copyProducts);
      })
      .catch(err => alert(err))
      .finally(() => setLoading(false));
  };



  return (
    <div className={cn()} ref={productRef}>
      <div className={cn('header')}>
        <h2 className={cn('title')}>Товары</h2>
        <Button type="primary">Добавить товар</Button>
      </div>

      <Table scroll={{x: 1200}} loading={loading} columns={columns} dataSource={products} />
      {
        changeCategory && (
          <ChangeCategoryModal
            product={changeCategory}
            handleClose={() => setChangeCategory(null)}
            onOk={handleChangeCategory}
          />
        )
      }
    </div>
  );
};

export default Products;