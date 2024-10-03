import React, { FC } from 'react';
import { AuthResponse } from '../../../types/user.type';
import CardItem from '../CardItem';

interface Product {
  _id: string; // Unique identifier for the product
  product1cId: string; // ID used in 1C system
  article: string; // Article number or code
  name: string; // Product name
  description: string; // Description in Russian
  description1c: string; // Additional description, possibly for 1C
  color: string[]; // Array of colors (empty in this case)
  equipment: string[]; // Array of equipment (empty in this case)
  category: string | null; // Category of the product (null if not applicable)
  size: string; // Size of the product
  is_active: boolean; // Indicates if the product is active
  __v: number; // Version key, usually for version control
}

interface IOrderItem {
  createdAt: string;
  products: Product[];
  totalAmount: number;
  user: AuthResponse;
  _id: string;
}

interface ICardListProps {
  list: IOrderItem[];
}

const CardList: FC<ICardListProps> = ({ list }) => {
  return (
    <div>
      {list.map((item) => (
        <CardItem
          key={item._id}
          totalAmount={item.totalAmount}
          user={item.user}
        />
      ))}
    </div>
  );
};

export default CardList;
