import React, { FC, useState } from 'react';
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
};

const CreateBannerModal: FC<CreateBannerModalProps> = ({
  open,
  handleOk,
  confirmLoading,
  handleCancel,
}) => {
  const cn = useClassName('banner');
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [searchParams] = useSearchParams();

  const resetValues = () => {
    form.resetFields();
    setImageFile(null);
    setPreviewImage('');
  };

  const onOk = () => {
    form
      .validateFields()
      .then(() => {
        handleOk(imageFile);
        resetValues();
      })
      .catch((errorInfo) => {
        console.log('Validation Failed:', errorInfo);
      });
  };

  const id = searchParams.get('id');

  const handleImageChange = (info: { file: any; fileList: any }) => {
    if (info.fileList.length) {
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
    }
  };

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
            beforeUpload={() => false}
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
