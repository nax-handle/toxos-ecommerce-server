import { Controller, Get, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import { Response } from 'express';
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('excel-export')
  async exportExcelReport(@Res() res: Response) {
    const workbook = await this.reportService.exportExcelReport({
      shopId: '28281d3a-2924-4e30-b539-84185ee94b52',
      fromDate: '2025-03-21 12:15:23.511817',
      toDate: '2025-04-01 12:15:23.511817',
    });
    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');
    res.send(buffer);
  }
  @Get('pdf-export')
  async exportPDFReport(@Res() res: Response) {
    const pdfDoc = await this.reportService.exportPDFReport({
      shopId: '28281d3a-2924-4e30-b539-84185ee94b52',
      fromDate: '2025-03-21 12:15:23.511817',
      toDate: '2025-04-01 12:15:23.511817',
    });
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(Buffer.from(pdfBytes));
  }
}
