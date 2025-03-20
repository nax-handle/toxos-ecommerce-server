export class Shop {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

export class Order {
  shop: Shop;
  totalPrice: number;
  paymentMethod: string;
  orderItems: CreateOrderItemDto[];
}

export class CreateOrderDto {
  userId: string;
  paymentMethod: string;
  orders: Order[];
}

export class CreateOrderItemDto {
  productName: string;
  productThumbnail: string;
  category: string;
  productId: string;
  variantId: string;
  tags: string;
  price: number;
  quantity: number;
}
