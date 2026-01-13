import { ResponseData } from "../../shared/types"

export type ProfileResponseData = {
    data: ResponseData<{
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        role: string,
    }>
}