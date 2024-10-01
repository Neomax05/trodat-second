export class SearchProductsQuery {
  search: string;
  categories: null | string[];
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
}
