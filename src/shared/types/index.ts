import { AxiosResponse } from "axios";

export type CreatedAt = string
export type UpdatedAt = string

export type BaseResponseData = {
    _id: string,
    createdAt: CreatedAt,
    updatedAt: string,
    isDeleted: boolean,
    isActive: boolean,
    __v: number,
}

export type ResponseData<T> = T & BaseResponseData;

export type PromiseResponseData<T> = Promise<AxiosResponse<ResponseData<T>>>;

export type PaginationParams = Partial<{
    page: number;
    limit: number;
    search: string;
    countryId: string
}>;