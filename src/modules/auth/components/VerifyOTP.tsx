import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import OTPInput from "react-otp-input";

import AuthLayout from "../../../shared/component/AuthLayout";
import AuthHeading from "../../../shared/component/AuthHeading";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { verifyOTP } from "../api";
import { VerifyOTPFormValues } from "../type";

type VerifyOTPProps = {
    setStep: (step: number) => void;
    email: string;
};

function VerifyOTP({ setStep, email }: VerifyOTPProps) {
    const { isPending, mutate: verifyOtpFn } = useMutation({
        mutationFn: verifyOTP,
        onSuccess: () => {
            setStep(3);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message);
        },
    });

    const formik = useFormik<VerifyOTPFormValues>({
        initialValues: {
            email,
            otp: "",
        },
        onSubmit: (data) => verifyOtpFn(data),
    });

    return (
        <AuthLayout>
            <div className="flex flex-col flex-1 w-full max-w-md mx-auto">
                <div className="w-full rounded-2xl border border-gray-200/80 bg-white p-8 shadow-theme-lg sm:p-10">
                    <AuthHeading subtitle="Enter the code we sent to your email">
                        Verify your email
                    </AuthHeading>
                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div>
                            <Label>Email</Label>
                            <Input
                                name="email"
                                value={email}
                                disabled
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label>
                                OTP <span className="text-error-500">*</span>
                            </Label>
                            <div className="mt-1.5 flex justify-center gap-1 flex-wrap">
                                <OTPInput
                                    value={formik.values.otp}
                                    onChange={(value) => formik.setFieldValue("otp", value)}
                                    numInputs={4}
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
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Remember your password?{" "}
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

export default VerifyOTP;
