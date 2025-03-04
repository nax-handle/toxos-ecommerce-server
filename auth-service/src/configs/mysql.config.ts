import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
const configService = new ConfigService();
export const MysqlConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: configService.get<string>('MYSQL_HOST'),
  port: parseInt(configService.get<string>('MYSQL_PORT') as string),
  username: configService.get<string>('MYSQL_USERNAME'),
  password: configService.get<string>('MYSQL_PASSWORD'),
  database: configService.get<string>('MYSQL_DATABASE'),
  autoLoadEntities: true,
  // synchronize: true,
  // dropSchema: true,
};
