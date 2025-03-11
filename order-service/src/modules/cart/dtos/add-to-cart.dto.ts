export class AddToCartDto {
  userId: String;
  productId: string;
  optionId?: string;
  variantId?: string;
  quantity: number;
  shopId: string;
}
