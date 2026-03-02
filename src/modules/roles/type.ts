export type Role = {
    _id: string;
    name: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};

export type RoleFormValues = {
    name: string;
    isActive: boolean;
};

export type CreateRoleParams = {
    name: string;
    isActive?: boolean;
};

export type UpdateRoleParams = {
    name?: string;
    isActive?: boolean;
};

export type RoleResponseData = {
    data: Role;
};

export type RoleListResponse = {
    items: Role[];
    page: number;
    totalPages: number;
    total: number;
};
