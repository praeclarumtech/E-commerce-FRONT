export type PaginationParams = Partial<{
  page: number;
  limit: number;
  search: string;
}>;

export interface BaseEntity {
  _id: string;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationResponse<T> {
  data: {
    data: T[];
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}
