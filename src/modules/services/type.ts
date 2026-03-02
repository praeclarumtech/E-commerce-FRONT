export type Service = {
    _id: string;
    isDeleted?: boolean;
    isActive?: boolean;
    key?: string;
    title?: string;
    subtitle?: string;
    icon?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    [key: string]: unknown;
};

export type CreateServiceParams = {
    key: string;
    title: string;
    subtitle: string;
    icon: string;
    isActive?: boolean;
};

export type UpdateServiceParams = Partial<CreateServiceParams>;
