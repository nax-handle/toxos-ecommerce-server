import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConfig } from 'src/configs/mysql.config';
@Module({
  imports: [TypeOrmModule.forRoot(MysqlConfig)],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
