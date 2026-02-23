export type Offer = {
    _id: string;
    type:ENUM_OFFER_TYPE;
    targetType: ENUM_OFFER_TARGET,
    [key: string]: unknown;
};

export enum ENUM_OFFER_TYPE {
    PERCENTAGE = 'percentage',
    FLAT = 'flat',
    FREE_SHIPPING = 'free_shipping',
    BUY_X_GET_Y = 'buy_x_get_y',
}

export enum  ENUM_OFFER_TARGET {
    PRODUCT = 'product',
    CATEGORY = 'category',
    VARIANT = 'variant',
    CART = 'cart',
}

export type CreateOfferParams = Record<string, unknown>;

export type UpdateOfferParams = Partial<CreateOfferParams>;
