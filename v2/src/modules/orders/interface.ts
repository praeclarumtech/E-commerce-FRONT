export type Order = {
  _id: string;
  orderId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};
