export class SearchProductDto {
  page: number;
  size: number;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  keyword: string;
  sortByPrice: string;
}
