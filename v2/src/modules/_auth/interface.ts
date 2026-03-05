export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponseData {
    data: {
        tokens: {
            accessToken: string,
            refreshToken: string,
        }
    }
}