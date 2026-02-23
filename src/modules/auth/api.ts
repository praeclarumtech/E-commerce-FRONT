import { AxiosResponse } from "axios";

import api from "../../shared/api";

import {
  ForgotPasswordRequestData,
  ForgotPasswordResponseData,
  ResetPasswordRequestData,
  ResetPasswordResponseData,
  SignInRequestData,
  SignInResponseData,
  SignUpRequestData,
  SignUpResponseData,
  UpdateUserRequestData,
  UpdateUserResponseData,
  VerifyMailRequertData,
  VerifyMailResponseData,
  VerifyOTPRequertData,
  VerifyOTPResponseData
} from "./type";

const signin = (data: SignInRequestData): Promise<AxiosResponse<SignInResponseData>> => {
  return api.post<SignInResponseData>('/auth/login', data);
};

const refreshToken = (): Promise<AxiosResponse<SignInResponseData>> => {
  return api.post<SignInResponseData>('/auth/refresh');
};

const getMe = () => {
  return api.get('/auth/me');
};

const signup = (data: SignUpRequestData): Promise<AxiosResponse<SignUpResponseData>> => {
  return api.post('/users/register', data)
}
const resetPassword = (data: ResetPasswordRequestData) : Promise<AxiosResponse<ResetPasswordResponseData>>  => {
  return api.post('/users/reset-password', data)
}

const forgotPassword = (data: ForgotPasswordRequestData): Promise<AxiosResponse<ForgotPasswordResponseData>> => {
  return api.post('/users/forgot-password', data)
}

const verifymail = (data: VerifyMailRequertData): Promise<AxiosResponse<VerifyMailResponseData>> => {
  return api.post('/users/verify-email', data)
}

const verifyOTP = (data: VerifyOTPRequertData): Promise<AxiosResponse<VerifyOTPResponseData>> => {
  return api.post('/users/verify-otp', data)
}

const verifyRegistrationOTP = (data: VerifyOTPRequertData): Promise<AxiosResponse<VerifyOTPResponseData>> => {
  return api.post('/users/verify-registration-otp', data)
}

const resendRegistrationOTP = (data: { email: string }): Promise<AxiosResponse<{ message: string }>> => {
  return api.post("/users/verify-otp", data);
}

const updateUserData = (data: UpdateUserRequestData):Promise<AxiosResponse<UpdateUserResponseData>> => {
  return api.put('/users/profile', data)
}

export {
  signin,
  signup,
  refreshToken,
  getMe,
  resetPassword,
  forgotPassword,
  verifymail,
  verifyOTP,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  updateUserData,
}