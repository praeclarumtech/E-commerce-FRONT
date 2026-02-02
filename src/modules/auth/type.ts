export type SignUpFormValues = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    role: any
}

export type SignInFormValues = {
    email: string,
    password: string,
}

export type ResetPasswordFormValues = {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
}

export type ForgotPasswordFormValues = {
    password: string,
    confirmPassword: string,
}

export type VerifyMailFormValues = {
    email: string,
}

export type VerifyOTPFormValues = {
    email: string
    otp: string,
}

export type UpdateUserDataFormValues = {
    firstName: string,
    lastName: string,
    email: string,
    phone: string
}

export type SignInRequestData = SignInFormValues;

export type SignUpRequestData = SignUpFormValues;

export type ResetPasswordRequestData = ResetPasswordFormValues;

export type ForgotPasswordRequestData = ForgotPasswordFormValues & {
    email: string
};

export type VerifyMailRequertData = VerifyMailFormValues & {
    type: 'email_verify'
};

export type VerifyOTPRequertData = Omit<VerifyOTPFormValues, 'otp'> & {
    otp: number
}

export type UpdateUserRequestData = UpdateUserDataFormValues;


/**
 * Types that we are getting as response of login api
*/
export type SignInResponseData = {
    data: {
        tokens: {
            accessToken: string,
            refreshToken: string,
        }
    }
}

export type SignUpResponseData = {
    data: {
        userId: string,
    }
}
export type ResetPasswordResponseData = {
    data: {
        userId: string,
    }
}

export type ForgotPasswordResponseData = {
    data: {
    }
}

export type VerifyMailResponseData = {
    message: string,
    expiresIn: string,
}

export type VerifyOTPResponseData = {
    data: {
        message: string,
        email: string,
        purpose: string,
    }
}

export type UpdateUserResponseData = {
    data: {
        isActive: string,
        isDeleted: string,
    }
}