import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import OTPInput from "react-otp-input";

import AuthLayout from "../../../shared/component/AuthLayout";
import AuthHeading from "../../../shared/component/AuthHeading";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import withoutAuth from "../../../shared/component/withoutAuth";
import { verifyRegistrationOTP, resendRegistrationOTP } from "../api";
import { VerifyOTPFormValues } from "../type";
import { verifyOTPSchema } from "../validations";

const RESEND_COOLDOWN_SECONDS = 60;

function VerifyRegistrationOTP() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = (location.state as { email?: string } | null)?.email ?? "";

    useEffect(() => {
        if (!email) {
            navigate("/signup", { replace: true });
        }
    }, [email, navigate]);

    const [resendCooldown, setResendCooldown] = useState(0);

    const { isPending, mutate } = useMutation({
        mutationFn: verifyRegistrationOTP,
        onSuccess: () => {
            toast.success("Email verified successfully. You can sign in now.");
            navigate("/signin", { replace: true });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message ?? "Verification failed.");
        },
    });

    const { isPending: isResending, mutate: resendOtp } = useMutation({
        mutationFn: resendRegistrationOTP,
        onSuccess: () => {
            toast.success("OTP sent. Please check your email.");
            setResendCooldown(RESEND_COOLDOWN_SECONDS);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message ?? "Failed to resend OTP.");
        },
    });

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const formik = useFormik<VerifyOTPFormValues>({
        initialValues: {
            email,
            otp: "",
        },
        validationSchema: verifyOTPSchema,
        enableReinitialize: true,
        onSubmit: (data) => mutate(data),
    });

    if (!email) {
        return null;
    }

    return (
        <AuthLayout>
            <div className="flex flex-col flex-1 w-full max-w-md mx-auto">
                <div className="w-full rounded-2xl border border-gray-200/80 bg-white p-8 shadow-theme-lg sm:p-10">
                    <AuthHeading subtitle="Enter the 6-digit code sent to your email">
                        Verify your email
                    </AuthHeading>
                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div>
                            <Label>
                                OTP <span className="text-error-500">*</span>
                            </Label>
                            <div className="mt-1.5 flex justify-center gap-1 flex-wrap">
                                <OTPInput
                                    value={formik.values.otp}
                                    onChange={(value) => formik.setFieldValue("otp", value)}
                                    numInputs={6}
                                    inputStyle={{
                                        width: "2.75rem",
                                        height: "2.75rem",
                                        fontSize: "1rem",
                                        borderRadius: 8,
                                        border: "2px solid rgb(229 231 235)",
                                    }}
                                    containerStyle="flex justify-center gap-2 flex-wrap"
                                    renderInput={(props) => <input {...props} />}
                                />
                            </div>
                            {formik.errors.otp && formik.touched.otp && (
                                <p className="mt-1 text-sm text-error-500">{formik.errors.otp}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full py-3 font-medium"
                            size="sm"
                            disabled={isPending}
                        >
                            {isPending ? "Verifying..." : "Verify OTP"}
                        </Button>
                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Didn&apos;t receive the code?{" "}
                            </span>
                            {resendCooldown > 0 ? (
                                <span className="text-sm text-gray-500">
                                    Resend OTP in {resendCooldown}s
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => resendOtp({ email })}
                                    disabled={isResending}
                                    className="text-sm font-medium text-brand-500 transition hover:text-brand-600 disabled:opacity-50"
                                >
                                    {isResending ? "Sending..." : "Resend OTP"}
                                </button>
                            )}
                        </div>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already verified?{" "}
                        <Link
                            to="/signin"
                            className="font-medium text-brand-500 transition hover:text-brand-600"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}

export default withoutAuth(VerifyRegistrationOTP);
