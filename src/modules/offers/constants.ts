/**
 * Match backend ENUM_OFFER_TYPE: percentage, flat, free_shipping, buy_x_get_y
 */
export const ENUM_OFFER_TYPE = {
    PERCENTAGE: "percentage",
    FLAT: "flat",
    FREE_SHIPPING: "free_shipping",
    BUY_X_GET_Y: "buy_x_get_y",
} as const;

export type OfferType = (typeof ENUM_OFFER_TYPE)[keyof typeof ENUM_OFFER_TYPE];

export const OFFER_TYPE_OPTIONS = [
    { value: ENUM_OFFER_TYPE.PERCENTAGE, label: "Percentage" },
    { value: ENUM_OFFER_TYPE.FLAT, label: "Flat" },
    { value: ENUM_OFFER_TYPE.FREE_SHIPPING, label: "Free shipping" },
    { value: ENUM_OFFER_TYPE.BUY_X_GET_Y, label: "Buy X get Y" },
];

/**
 * Match backend ENUM_OFFER_TARGET: product, category, variant, cart
 */
export const ENUM_OFFER_TARGET = {
    PRODUCT: "product",
    CATEGORY: "category",
    VARIANT: "variant",
    CART: "cart",
} as const;

export type OfferTarget = (typeof ENUM_OFFER_TARGET)[keyof typeof ENUM_OFFER_TARGET];

export const OFFER_TARGET_OPTIONS = [
    { value: ENUM_OFFER_TARGET.PRODUCT, label: "Product(s)" },
    { value: ENUM_OFFER_TARGET.CATEGORY, label: "Category" },
    { value: ENUM_OFFER_TARGET.VARIANT, label: "Variant(s)" },
    { value: ENUM_OFFER_TARGET.CART, label: "Cart" },
];
