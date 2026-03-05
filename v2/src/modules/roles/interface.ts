import type { BaseEntity } from "../../shared/interface";

export interface RoleResponse extends BaseEntity {
    name: string;
    accessModules: string[];
};
