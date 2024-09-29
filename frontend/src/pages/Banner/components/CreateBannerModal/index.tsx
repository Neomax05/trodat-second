import React, { FC, useState, useCallback } from 'react';
import { Modal, Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { useClassName } from '../../../../utils/cn';

type CreateBannerModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleOk: (imageFile: File | null) => Promise<void>;
  confirmLoading: boolean;
  handleCancel: () => void;
  getBanners: () => Promise<void>;
};

const CreateBannerModal: FC<CreateBannerModalProps> = ({
  open,
  handleOk,
  confirmLoading,
  handleCancel,
  getBanners,
}) => {
  const cn = useClassName('banner');
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [searchParams] = useSearchParams();

  const id = searchParams.get('id');

  // Reset form and state values
  const resetValues = useCallback(() => {
    form.resetFields();
    setImageFile(null);
    setPreviewImage('');
  }, [form]);

  // Handle image change and validation
  const handleImageChange = useCallback((info: { fileList: any[] }) => {
    const file = info.fileList[0]?.originFileObj;

    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setPreviewImage('');
      alert('Please upload a valid image file');
    }
  }, []);

  // Submit form after validation
  const onOk = useCallback(() => {
    form
      .validateFields()
      .then(async () => {
        await handleOk(imageFile);
        await getBanners();
        resetValues();
      })
      .catch((errorInfo) => {
        console.error('Validation Failed:', errorInfo);
      });
  }, [form, handleOk, getBanners, imageFile, resetValues]);

  return (
    <Modal
      title={id ? 'Редактирование новости' : 'Создание новости'}
      open={open}
      onOk={onOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      okText={id ? 'Редактировать' : 'Создать'}
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
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleImageChange}
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

export default CreateBannerModal;
