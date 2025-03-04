import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBConfig } from 'src/configs/mongodb.config';
console.log(MongoDBConfig);
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://minhnguyen11a1cmg:PCEIvzbN1LIvTJbO@cluster0.bt643dm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' as string,
      {
        dbName: MongoDBConfig.dbName || 'curxor',
        appName: MongoDBConfig.appName || 'curxor',
      },
    ),
  ],
})
export class MongoDBModule {}
