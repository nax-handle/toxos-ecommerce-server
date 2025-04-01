import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ExcelReportVisitor } from './visitor-report/excel-report.visitor';
import { PdfReportVisitor } from './visitor-report/pdf-report.visitor';

@Module({
  controllers: [ReportController],
  providers: [ReportService, ExcelReportVisitor, PdfReportVisitor],
  exports: [ReportService],
})
export class ReportModule {}
