import React, { FC, useCallback, useEffect, useState } from 'react';
import { Modal, Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { useClassName } from '../../../../utils/cn';
import { api } from '../../../../utils/api';
import { imageUrl } from '../../../../utils/constants';

type EditBannerModalProps = {
  confirmLoading: boolean;
  getBanners: () => Promise<void>;
};

const EditBannerModal: FC<EditBannerModalProps> = ({
  confirmLoading,
  getBanners,
}) => {
  const cn = useClassName('banner');
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();

  const bannerId = searchParams.get('id');

  const getBannerByIdAsync = useCallback(async (id: string) => {
    try {
      const { data } = await api.get(`/banner/${id}`);

      setPreviewImage(`${imageUrl}${data?.image}`);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleCreateNews = async (imageFile: File | null) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    try {
      await api.put(`/banner/${bannerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // This may be optional with FormData
        },
      });
      await getBanners();
    } catch (err) {
      alert(err);
    } finally {
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    if (bannerId) {
      setIsModalVisible(true);
      getBannerByIdAsync(bannerId);
    }
  }, [bannerId, getBannerByIdAsync]);

  const resetForm = () => {
    form.resetFields();
    setImageFile(null);
    setPreviewImage('');
  };

  const handleModalOk = async () => {
    try {
      await form.validateFields();
      await handleCreateNews(imageFile);
      resetForm();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    resetForm();

    searchParams.delete('id');
    setSearchParams(searchParams);
  };

  const handleImageUpload = (info: { fileList: any[] }) => {
    const file = info.fileList[0]?.originFileObj;

    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      setImageFile(null);
      setPreviewImage('');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      title="Редактирование Banner"
      open={isModalVisible}
      onOk={handleModalOk}
      confirmLoading={confirmLoading}
      onCancel={handleModalCancel}
      okText="Редактировать"
      cancelText="Отмена"
    >
      <Form
        form={form}
        initialValues={{
          title: '',
          type: '',
          shortDescription: '',
          fullDescription: '',
        }}
      >
        <Form.Item
          label="Изображение"
          rules={[{ required: true, message: 'Загрузите изображение' }]}
        >
          <Upload
            accept="image/*"
            beforeUpload={() => false}
            onChange={handleImageUpload}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Загрузить изображение</Button>
          </Upload>
        </Form.Item>

        {previewImage && (
          <div className={cn('image-container')}>
            <img
              src={previewImage}
              alt="Preview"
              className={cn('card-image')}
            />
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default EditBannerModal;
