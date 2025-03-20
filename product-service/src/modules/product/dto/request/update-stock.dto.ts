export class UpdateStockDto {
  orderIds: string;
  items: Item[];
}
class Item {
  productId: string;
  variantId: string;
  quantity: number;
}
