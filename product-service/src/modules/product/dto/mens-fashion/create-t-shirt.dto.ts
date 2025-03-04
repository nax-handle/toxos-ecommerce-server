import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { CreateProductDto } from '../create-product.dto';

export class CreateTShirtDto extends CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  shirtLength: number;

  @IsString()
  @IsNotEmpty()
  material: string;
}
