export type InventoryRecord = {
  _id?: string;
  variantId?: string;
  quantity?: number;
  reserved?: number;
  available?: number;
  [key: string]: unknown;
};

export type ReserveInventoryParams = { quantity: number };
export type ReleaseInventoryParams = { quantity: number };
export type DeductInventoryParams = { quantity: number };
