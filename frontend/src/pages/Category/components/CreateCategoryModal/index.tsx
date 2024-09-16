import React, {FC, useState} from 'react';
import {Modal, Form, Input} from "antd";

type CreateCategoryModalProps = {
  open: boolean;
  handleOk: (name: string) => Promise<void>;
  confirmLoading: boolean;
  handleCancel: () => void;
};

const CreateCategoryModal: FC<CreateCategoryModalProps> = ({open, handleOk, confirmLoading, handleCancel}) => {
  const [name, setName] = useState<string>('');
  const onOk = () => {
    if (name) {
      handleOk(name);
      setName('');
    }
  };

  return (
    <Modal
      title="Создание категории"
      open={open}
      onOk={onOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      okText="Создать"
      cancelText="Отмена"
    >
      <Form.Item
        style={{marginTop: 24}}
        label="Название"
        name="name"
      >
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Введите название категории"
        />
      </Form.Item>
    </Modal>
  );
};

export default CreateCategoryModal;