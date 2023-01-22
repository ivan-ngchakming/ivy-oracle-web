export type Paginated<T> = {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
};
