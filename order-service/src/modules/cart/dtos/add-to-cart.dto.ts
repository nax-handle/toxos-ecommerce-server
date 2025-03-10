export class AddToCartDto {
  productId: string;
  optionId?: string;
  variantId?: string;
  quantity: number;
  shopId: string;
}
