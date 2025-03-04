export interface Product {
  title: string;
  slug: string;
  status: string;
  description: string;
  image: string;
  soldCount?: number | undefined;
  brand: string;
  origin: string;
  shopId: string;
  categoryId: string;
  attributes: Record<any, string>;
  getData(): Product;
}
