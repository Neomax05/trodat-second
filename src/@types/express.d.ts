// src/types/express.d.ts

import { User } from 'src/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User; // Добавляем пользовательское свойство
    }
  }
}
