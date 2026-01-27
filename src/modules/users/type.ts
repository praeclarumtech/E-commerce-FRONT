export type UserRole = {
    _id: string;
    name: string;
    isActive?: boolean;
    accessModules?: string[];
};

export type User = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type UserFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone: string;
    gender: string;
    role: string;
};

export type CreateUserParams = UserFormValues & {
    password: string;
};

export type UpdateUserParams = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    gender?: string;
    role?: string;
};

export type UserResponseData = {
    data: {
        userId: string;
    };
};

// Keep old types for backwards compatibility
export type AddUserFormValues = UserFormValues;
export type AddUserRequestData = CreateUserParams;
export type AddUserResponseData = UserResponseData;
