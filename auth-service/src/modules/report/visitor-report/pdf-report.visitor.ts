import { PDFDocument, PDFFont } from 'pdf-lib';
import { ReportVisitor } from '../interface/report-visitor.interface';
import { Product } from '../interface/product.interface';
import { Order, OrderItem } from '../interface/order.interface';
import { readFileSync } from 'fs';
import { join } from 'path';
import fontkit from '@pdf-lib/fontkit';

export class PdfReportVisitor implements ReportVisitor {
  constructor(
    public readonly pdfDoc: PDFDocument,
    private readonly font: PDFFont,
  ) {}

  public static async create(): Promise<PdfReportVisitor> {
    const pdfDoc = await PDFDocument.create();

    pdfDoc.registerFontkit(fontkit);

    const fontBytes = readFileSync(
      join(process.cwd(), 'src', 'assets', 'font', 'Roboto-Regular.ttf'),
    );
    console.log(fontBytes);
    const font = await pdfDoc.embedFont(fontBytes, {
      subset: true,
    });

    return new PdfReportVisitor(pdfDoc, font);
  }
  visitProduct(products: Product[]) {
    const page = this.pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();

    let y = height - 50;
    page.drawText('Product Report', { x: 50, y, size: 18, font: this.font });
    y -= 30;

    page.drawText('Product Name | Variant | Price | Stock', {
      x: 50,
      y,
      size: 12,
      font: this.font,
    });
    y -= 20;

    products.forEach((product) => {
      if (product.variants?.length) {
        product.variants.forEach((variant) => {
          page.drawText(
            `${product.optionName} | ${variant.name} | $${variant.price} | ${variant.stock}`,
            { x: 50, y, size: 10, font: this.font },
          );
          y -= 15;
        });
      } else {
        page.drawText(
          `${product.optionName} | Default | $${product.price} | ${product.stock}`,
          { x: 50, y, size: 10, font: this.font },
        );
        y -= 15;
      }
    });
  }

  visitOrder(orders: Order[]) {
    const page = this.pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();

    let y = height - 50;
    page.drawText('Order Report', { x: 50, y, size: 18, font: this.font });
    y -= 30;

    page.drawText(
      'Order ID | Product Name | Variant ID | Price | Quantity | Total',
      { x: 50, y, size: 12, font: this.font },
    );
    y -= 20;

    let totalRevenue = 0;
    let totalQuantity = 0;

    orders.forEach((order) => {
      order.orderItems.forEach((item: OrderItem) => {
        const itemTotal = item.price * item.quantity;
        totalRevenue += itemTotal;
        totalQuantity += item.quantity;

        page.drawText(
          `${order.id} | ${item.productName} | ${item.variantId || 'N/A'} | $${item.price} | ${item.quantity} | $${itemTotal}`,
          { x: 50, y, size: 10, font: this.font },
        );
        y -= 15;
      });
    });

    page.drawText(`Total Revenue: $${totalRevenue}`, {
      x: 50,
      y,
      size: 12,
      font: this.font,
    });
    y -= 20;
    page.drawText(`Total Quantity: ${totalQuantity}`, {
      x: 50,
      y,
      size: 12,
      font: this.font,
    });
  }
}
