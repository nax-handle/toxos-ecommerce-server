import { User } from 'src/modules/user/entities/user.entity';

export class RegisterShopDto {
  name: string;
  logo: string;
  description: string;
  phoneNumber: string;
  address: string;
  detailedAddress: string;
  user: User;
}
