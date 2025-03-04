import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();
export const MongoDBConfig = {
  dbName: configService.get<string>('MONGODB_NAME'),
  appName: configService.get<string>('MONGODB_NAME'),
  uri: configService.get<string>('MONGODB_URI'),
};
