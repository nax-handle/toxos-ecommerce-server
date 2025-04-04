import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { Response } from 'express';
import { GetReportDataDto } from './dto/get-report-data.dto';
import { ShopGuard } from 'src/common/guards/shop.guard';
import { Shop } from '../shop/entities/shop.entity';
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('excel-export')
  @UseGuards(ShopGuard)
  async exportExcelReport(
    @Res() res: Response,
    @Req() req: Request,
    @Query() queries: GetReportDataDto,
  ) {
    console.log({ ...queries });
    const shop = req['shop'] as Shop;
    const workbook = await this.reportService.exportExcelReport({
      ...queries,
      shopId: shop.id,
    });
    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');
    res.send(buffer);
  }
  @UseGuards(ShopGuard)
  @Get('pdf-export')
  async exportPDFReport(
    @Res() res: Response,
    @Req() req: Request,
    @Query() queries: GetReportDataDto,
  ) {
    const shop = req['shop'] as Shop;
    const pdfDoc = await this.reportService.exportPDFReport({
      ...queries,
      shopId: shop.id,
    });
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(Buffer.from(pdfBytes));
  }
}
