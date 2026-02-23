export type Service = {
    _id: string;
    [key: string]: unknown;
};

export type CreateServiceParams = Record<string, unknown>;

export type UpdateServiceParams = Partial<CreateServiceParams>;
