import type { BaseEntity } from "../../shared/interface";

export interface UserRole {
    _id: string;
    isActive: boolean;
    name: string;
}

export interface UserResponse extends BaseEntity {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string | null;
    dob: string | null;
    role?: UserRole;
    roleId?: string;
    isVerified?: boolean;
    __v?: number;
}