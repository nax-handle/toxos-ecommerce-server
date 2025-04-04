import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ExcelReportVisitor } from './visitor-report/excel-report.visitor';
import { PdfReportVisitor } from './visitor-report/pdf-report.visitor';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TokenService } from '../auth/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports: [
    UserModule,
    ShopModule,
    ClientsModule.register([
      {
        name: 'GRPC_PRODUCT_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50052',
          package: ['product'],
          protoPath: ['src/proto/product.proto'],
        },
      },
      {
        name: 'GRPC_ORDER_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50051',
          package: ['order'],
          protoPath: ['src/proto/order.proto'],
        },
      },
    ]),
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    ExcelReportVisitor,
    PdfReportVisitor,
    TokenService,
    JwtService,
  ],
  exports: [ReportService],
})
export class ReportModule {}
