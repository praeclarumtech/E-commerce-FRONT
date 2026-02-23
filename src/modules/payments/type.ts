export type Payment = {
    _id: string;
    [key: string]: unknown;
};

export type PaymentListResponse = {
    data: Payment[];
};

export type PaymentDetailResponse = {
    data: Payment;
};
