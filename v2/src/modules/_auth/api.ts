import type { AxiosResponse } from "axios";

import api from "../../shared/api";
import type { LoginPayload, LoginResponseData } from "./interface";

export function signin(data: LoginPayload): Promise<AxiosResponse<LoginResponseData>> {
    return api.post<LoginResponseData>('/auth/login', data);
};