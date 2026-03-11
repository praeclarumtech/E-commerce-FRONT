export type BrandImage = {
  _id?: string;
  imageUrl: string;
  isPrimary?: boolean;
};

export type Brand = {
  _id: string;
  isDeleted?: boolean;
  isActive?: boolean;
  brandName?: string;
  description?: string;
  images?: BrandImage[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  [key: string]: unknown;
};

export type CreateBrandParams = {
  brandName: string;
  description?: string;
  images?: File[];
};

export type UpdateBrandParams = {
  brandName?: string;
  description?: string;
  images?: File[];
};
