import { Inject, Injectable } from '@nestjs/common';
import { ExcelReportVisitor } from './visitor-report/excel-report.visitor';
import { Visitor } from './interface/visitor';
import { Order, Orders } from './interface/order.interface';
import { Product, Products } from './interface/product.interface';
import { Workbook } from 'exceljs';
import { PDFDocument } from 'pdf-lib';
import { PdfReportVisitor } from './visitor-report/pdf-report.visitor';
import { GetReportDataDto } from './dto/get-report-data.dto';
import { ProductService } from 'src/common/interfaces/product-service.interface';
import { ClientGrpc } from '@nestjs/microservices';
import { OrderService } from 'src/common/interfaces/order-service.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ReportService {
  private productService: ProductService;
  private orderService: OrderService;
  constructor(
    @Inject('GRPC_PRODUCT_SERVICE') private clientProduct: ClientGrpc,
    @Inject('GRPC_ORDER_SERVICE') private clientOrder: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService =
      this.clientProduct.getService<ProductService>('ProductService');
    this.orderService =
      this.clientOrder.getService<OrderService>('OrderService');
  }
  async getReportData(
    getReportData: GetReportDataDto,
  ): Promise<{ orders: Order[]; products: Product[] }> {
    const { shopId } = getReportData;
    const productData = await lastValueFrom(
      this.productService.FindByShopId({ shopId }),
    );
    const orderData = await lastValueFrom(
      this.orderService.GetOrdersByShopId({ ...getReportData }),
    );
    return {
      orders: orderData?.orders ?? [],
      products: productData?.items ?? [],
    };
  }
  async exportExcelReport(getReportData: GetReportDataDto): Promise<Workbook> {
    const { orders, products } = await this.getReportData(getReportData);
    const excelReport = new ExcelReportVisitor();
    const visitors: Visitor[] = [new Orders(orders), new Products(products)];
    visitors.forEach((visitor) => {
      visitor.accept(excelReport);
    });
    return excelReport.workbook;
  }
  async exportPDFReport(getReportData: GetReportDataDto): Promise<PDFDocument> {
    const { orders, products } = await this.getReportData(getReportData);
    const visitors: Visitor[] = [new Orders(orders), new Products(products)];
    const pdfReportVisitor = await PdfReportVisitor.create();
    visitors.forEach((visitor) => {
      visitor.accept(pdfReportVisitor);
    });

    return pdfReportVisitor.pdfDoc;
  }
}
