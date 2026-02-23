export type Order = {
    _id: string;
    [key: string]: unknown;
};

export type OrderListResponse = {
    data: { items: Order[]; total?: number };
};

export type OrderDetailResponse = {
    data: Order;
};

export type UpdateOrderParams = Partial<Record<string, unknown>>;
