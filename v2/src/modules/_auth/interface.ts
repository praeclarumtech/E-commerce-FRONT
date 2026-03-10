export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponseData {
    data: {
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    };
}

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
}

export interface RegisterResponseData {
    data?: { message?: string };
}

export interface ForgotPasswordRequestPayload {
    email: string;
}

export interface ResetPasswordPayload {
    email: string;
    otp: string;
    newPassword: string;
}