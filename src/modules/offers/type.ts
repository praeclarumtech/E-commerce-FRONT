import type { OfferType, OfferTarget } from "./constants";

export type Offer = {
    _id: string;
    name?: string;
    code?: string;
    description?: string;
    type?: OfferType;
    value?: number;
    minOrderValue?: number;
    startDate?: string;
    endDate?: string;
    targetType?: OfferTarget;
    targetIds?: string[];
    isStackable?: boolean;
    usageLimit?: number;
    usageLimitPerUser?: number;
    isActive?: boolean;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
};

export type CreateOfferParams = {
    name: string;
    code?: string;
    description?: string;
    type: OfferType;
    value: number;
    minOrderValue?: number;
    startDate?: string;
    endDate?: string;
    targetType: OfferTarget;
    targetIds?: string[];
    isStackable?: boolean;
    usageLimit?: number;
    usageLimitPerUser?: number;
    isActive?: boolean;
    createdBy?: string;
};

export type UpdateOfferParams = Partial<CreateOfferParams>;
