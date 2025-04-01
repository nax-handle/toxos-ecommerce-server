import * as ExcelJS from 'exceljs';
import { ReportVisitor } from '../interface/report-visitor.interface';
import { Product } from '../interface/product.interface';
import { Order, OrderItem } from '../interface/order.interface';

export class ExcelReportVisitor implements ReportVisitor {
  public workbook: ExcelJS.Workbook;

  constructor() {
    this.workbook = new ExcelJS.Workbook();
  }

  visitProduct(products: Product[]) {
    const sheet = this.workbook.addWorksheet('Products');

    sheet.columns = [
      { header: 'Product Name', key: 'name', width: 30 },
      { header: 'Variant', key: 'variant', width: 25 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Stock', key: 'stock', width: 15 },
    ];

    products.forEach((product) => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          sheet.addRow({
            name: product.optionName,
            variant: variant.name,
            price: variant.price,
            stock: variant.stock,
          });
        });
      } else {
        sheet.addRow({
          name: product.optionName,
          variant: 'Default',
          price: product.price,
          stock: product.stock,
        });
      }
    });
  }

  visitOrder(orders: Order[]) {
    const sheet = this.workbook.addWorksheet('Orders');

    sheet.columns = [
      { header: 'Order ID', key: 'orderId', width: 20 },
      { header: 'Product Name', key: 'productName', width: 30 },
      { header: 'Variant ID', key: 'variantId', width: 20 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Total Price', key: 'total', width: 15 },
    ];

    let totalRevenue = 0;
    let totalQuantity = 0;

    orders.forEach((order) => {
      order.orderItems.forEach((item: OrderItem) => {
        const itemTotal = item.price * item.quantity;
        totalRevenue += itemTotal;
        totalQuantity += item.quantity;

        sheet.addRow({
          orderId: order.id,
          productName: item.productName,
          variantId: item.variantId || 'N/A',
          price: item.price,
          quantity: item.quantity,
          total: itemTotal,
        });
      });
    });

    sheet.addRow({});
    sheet.addRow({
      orderId: 'Total',
      total: totalRevenue,
      quantity: totalQuantity,
    });
  }
}
