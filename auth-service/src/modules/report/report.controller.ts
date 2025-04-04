import { Body, Controller, Get, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import { Response } from 'express';
import { GetReportDataDto } from './dto/get-report-data.dto';
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('excel-export')
  async exportExcelReport(
    @Res() res: Response,
    @Body() body: GetReportDataDto,
  ) {
    const workbook = await this.reportService.exportExcelReport(body);
    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');
    res.send(buffer);
  }

  @Get('pdf-export')
  async exportPDFReport(@Res() res: Response, @Body() body: GetReportDataDto) {
    const pdfDoc = await this.reportService.exportPDFReport(body);
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(Buffer.from(pdfBytes));
  }
}
