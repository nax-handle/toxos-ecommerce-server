import { User } from 'src/modules/user/entities/user.entity';

export class TokenDto {
  user?: User;
  accessToken: string;
  refreshToken: string;
}
