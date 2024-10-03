import { Length } from 'class-validator';

export class CreateCategoryDto {
  @Length(4, 100)
  name: string;
}
