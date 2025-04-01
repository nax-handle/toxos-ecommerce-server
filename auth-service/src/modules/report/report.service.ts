import { Injectable } from '@nestjs/common';
import { ExcelReportVisitor } from './visitor-report/excel-report.visitor';
import { Visitor } from './interface/visitor';
import { Orders } from './interface/order.interface';
import { Products } from './interface/product.interface';
import { Workbook } from 'exceljs';
import { PDFDocument } from 'pdf-lib';
import { PdfReportVisitor } from './visitor-report/pdf-report.visitor';

@Injectable()
export class ReportService {
  constructor(
    private excelReportVisitor: ExcelReportVisitor,
    private pdfReportVisitor: PdfReportVisitor,
  ) {}

  exportExcelReport(): Workbook {
    const visitors: Visitor[] = [new Orders([]), new Products([])];
    visitors.forEach((visitor) => {
      visitor.accept(this.excelReportVisitor);
    });
    return this.excelReportVisitor.workbook;
  }
  async exportPDFReport(): Promise<PDFDocument> {
    const visitors: Visitor[] = [new Orders([]), new Products([])];
    this.pdfReportVisitor = await PdfReportVisitor.create();
    visitors.forEach((visitor) => {
      visitor.accept(this.pdfReportVisitor);
    });
    return this.pdfReportVisitor.pdfDoc;
  }
}
