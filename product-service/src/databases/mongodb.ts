import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBConfig } from 'src/configs/mongodb.config';
@Module({
  imports: [
    MongooseModule.forRoot(MongoDBConfig.uri as string, {
      dbName: MongoDBConfig.dbName,
      appName: MongoDBConfig.appName,
    }),
  ],
})
export class MongoDBModule {}
