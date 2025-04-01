import { Controller, Get, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import { Response } from 'express';
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('excel-export')
  async exportExcelReport(@Res() res: Response) {
    const workbook = this.reportService.exportExcelReport();
    const buffer = await workbook.xlsx.writeBuffer(); //
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');
    res.send(buffer);
  }
  @Get('pdf-export')
  async exportPDFReport(@Res() res: Response) {
    const pdfDoc = await this.reportService.exportPDFReport();
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(Buffer.from(pdfBytes));
  }
}
