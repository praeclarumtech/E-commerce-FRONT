import type { AxiosResponse } from "axios";

import api from "../../shared/api";
import type {
    LoginPayload,
    LoginResponseData,
    RegisterPayload,
    RegisterResponseData,
    ForgotPasswordRequestPayload,
    ResetPasswordPayload,
    VerifyRegistrationOtpPayload,
    VerifyOtpPayload,
    VerifyEmailPayload,
} from "./interface";

export function signin(data: LoginPayload): Promise<AxiosResponse<LoginResponseData>> {
    return api.post<LoginResponseData>("/auth/login", data);
}

export function register(data: RegisterPayload): Promise<AxiosResponse<RegisterResponseData>> {
    return api.post<RegisterResponseData>("/auth/register", data);
}

export function forgotPasswordRequest(
    data: ForgotPasswordRequestPayload
): Promise<AxiosResponse<{ data?: { message?: string } }>> {
    return api.post("/auth/forgot-password", data);
}

export function resetPassword(
    data: ResetPasswordPayload
): Promise<AxiosResponse<{ data?: { message?: string } }>> {
    return api.post("/auth/reset-password", data);
}

export function verifyRegistrationOtp(
    data: VerifyRegistrationOtpPayload
): Promise<AxiosResponse<{ data?: { message?: string } }>> {
    return api.post("/auth/verify-registration-otp", data);
}

export function verifyOtp(
    data: VerifyOtpPayload
): Promise<AxiosResponse<{ data?: { message?: string } }>> {
    return api.post("/auth/verify-otp", data);
}

export function verifyEmail(
    data: VerifyEmailPayload
): Promise<AxiosResponse<{ data?: { message?: string } }>> {
    return api.post("/auth/verify-email", data);
}