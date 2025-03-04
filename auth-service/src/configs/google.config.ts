import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();
export const GoogleConfig = {
  clientId: configService.get<string>('GOOGLE_CLIENT_ID'),
  clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
  redirectUri: configService.get<string>('GOOGLE_CALLBACK_URL'),
};
