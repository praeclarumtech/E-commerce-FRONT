import { useState } from "react";

import { mdiEye, mdiEyeOff } from "@mdi/js";
import { Formik, Form, Field } from "formik";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import Icon from "../../_components/Icon";
import SectionFullScreen from "../../_components/Section/FullScreen";
import { verifyMail, resetPasswordWithOTPSchema } from "../validation";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordRequest, resetPassword } from "../api";
import type { ForgotPasswordRequestPayload, ResetPasswordPayload } from "../interface";
import { toast } from "../../_lib/toast";

const passwordToggleStyle = {
    button:
        "absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800",
    iconSize: 22,
    iconClass: "block text-current",
} as const;

type Step = "email" | "reset";

function ForgotPassword() {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const requestMutation = useMutation({
        mutationFn: (payload: ForgotPasswordRequestPayload) => forgotPasswordRequest(payload),
        onSuccess: (_, variables) => {
            setEmail(variables.email);
            setStep("reset");
            toast.success("OTP sent to your email. Please check your inbox.");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? "Failed to send OTP");
        },
    });

    const resetMutation = useMutation({
        mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
        onSuccess: () => {
            toast.success("Password reset successfully. Please sign in.");
            navigate("/login", { replace: true });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? "Failed to reset password");
        },
    });

    if (step === "reset") {
        return (
            <SectionFullScreen bg="dark">
                <div className="dark w-full flex justify-center">
                    <CardBox className="w-11/12 max-w-md shadow-2xl">
                        <div className="text-slate-200 [&_input]:text-white [&_input]:placeholder-gray-400 [&_input]:caret-white [&_select]:text-white">
                            <div className="mb-6 sm:mb-8 text-center">
                                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                    Reset Password
                                </h1>
                                <p className="mt-1.5 text-sm text-slate-400">
                                    Enter the OTP sent to your email and your new password
                                </p>
                            </div>
                            <Formik
                                initialValues={{
                                    email,
                                    otp: "",
                                    newPassword: "",
                                    confirmPassword: "",
                                }}
                                validationSchema={resetPasswordWithOTPSchema}
                                validateOnChange={false}
                                onSubmit={(values) =>
                                    resetMutation.mutate({
                                        email: values.email,
                                        otp: values.otp,
                                        newPassword: values.newPassword,
                                    })
                                }
                                enableReinitialize
                            >
                                {({ errors }) => (
                                    <Form className="space-y-5">
                                        <FormField label="Email *" labelFor="reset-email">
                                            {({ className }) => (
                                                <>
                                                    <Field
                                                        name="email"
                                                        type="email"
                                                        id="reset-email"
                                                        placeholder="info@gmail.com"
                                                        className={className}
                                                        disabled
                                                    />
                                                    {errors.email && (
                                                        <p className="mt-1 text-xs text-red-400">
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </FormField>

                                        <FormField label="OTP *" labelFor="otp">
                                            {({ className }) => (
                                                <>
                                                    <Field
                                                        name="otp"
                                                        type="text"
                                                        id="otp"
                                                        placeholder="Enter 6-digit OTP"
                                                        className={className}
                                                        maxLength={6}
                                                    />
                                                    {errors.otp && (
                                                        <p className="mt-1 text-xs text-red-400">
                                                            {errors.otp}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </FormField>

                                        <FormField label="New Password *" labelFor="newPassword">
                                            {({ className }) => (
                                                <div className="relative">
                                                    <Field
                                                        name="newPassword"
                                                        type={showPassword ? "text" : "password"}
                                                        id="newPassword"
                                                        placeholder="Enter new password"
                                                        className={`${className} pr-10`}
                                                    />
                                                    {errors.newPassword && (
                                                        <p className="mt-1 text-xs text-red-400">
                                                            {errors.newPassword}
                                                        </p>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(!showPassword)
                                                        }
                                                        className={passwordToggleStyle.button}
                                                        aria-label={
                                                            showPassword
                                                                ? "Hide password"
                                                                : "Show password"
                                                        }
                                                    >
                                                        <Icon
                                                            path={
                                                                showPassword
                                                                    ? mdiEyeOff
                                                                    : mdiEye
                                                            }
                                                            size={passwordToggleStyle.iconSize}
                                                            className={
                                                                passwordToggleStyle.iconClass
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            )}
                                        </FormField>

                                        <FormField
                                            label="Confirm Password *"
                                            labelFor="confirmPassword"
                                        >
                                            {({ className }) => (
                                                <>
                                                    <Field
                                                        name="confirmPassword"
                                                        type="password"
                                                        id="confirmPassword"
                                                        placeholder="Confirm new password"
                                                        className={className}
                                                    />
                                                    {errors.confirmPassword && (
                                                        <p className="mt-1 text-xs text-red-400">
                                                            {errors.confirmPassword}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </FormField>

                                        <Button
                                            type="submit"
                                            label="Reset Password"
                                            color="info"
                                            className="w-full py-3 font-medium"
                                            disabled={resetMutation.isPending}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setStep("email")}
                                            className="w-full mt-2 text-sm text-slate-400 hover:text-blue-400 transition"
                                        >
                                            Use a different email
                                        </button>

                                        <p className="mt-6 text-center text-sm text-slate-400">
                                            Remember your password?{" "}
                                            <Link
                                                to="/login"
                                                className="font-medium text-blue-400 transition hover:text-blue-300"
                                            >
                                                Sign In
                                            </Link>
                                        </p>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </CardBox>
                </div>
            </SectionFullScreen>
        );
    }

    return (
        <SectionFullScreen bg="dark">
            <div className="dark w-full flex justify-center">
                <CardBox className="w-11/12 max-w-md shadow-2xl">
                    <div className="text-slate-200 [&_input]:text-white [&_input]:placeholder-gray-400 [&_input]:caret-white">
                        <div className="mb-6 sm:mb-8 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Forgot Password
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-400">
                                Enter your email and we&apos;ll send you an OTP to reset your
                                password
                            </p>
                        </div>
                        <Formik
                            initialValues={{ email: "" }}
                            validationSchema={verifyMail}
                            validateOnChange={false}
                            onSubmit={(values) =>
                                requestMutation.mutate({ email: values.email })
                            }
                        >
                            {({ errors }) => (
                                <Form className="space-y-5">
                                    <FormField label="Email *" labelFor="forgot-email">
                                        {({ className }) => (
                                            <>
                                                <Field
                                                    name="email"
                                                    type="email"
                                                    id="forgot-email"
                                                    placeholder="info@gmail.com"
                                                    className={className}
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-xs text-red-400">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </FormField>

                                    <Button
                                        type="submit"
                                        label="Send OTP"
                                        color="info"
                                        className="w-full py-3 font-medium"
                                        disabled={requestMutation.isPending}
                                    />

                                    <p className="mt-6 text-center text-sm text-slate-400">
                                        Remember your password?{" "}
                                        <Link
                                            to="/login"
                                            className="font-medium text-blue-400 transition hover:text-blue-300"
                                        >
                                            Sign In
                                        </Link>
                                    </p>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </CardBox>
            </div>
        </SectionFullScreen>
    );
}

export default ForgotPassword;
