export type Offer = {
    _id: string;
    [key: string]: unknown;
};

export type CreateOfferParams = Record<string, unknown>;

export type UpdateOfferParams = Partial<CreateOfferParams>;
