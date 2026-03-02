import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";

import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import AuthLayout from "../../../shared/component/AuthLayout";
import AuthHeading from "../../../shared/component/AuthHeading";
import Button from "../../../components/ui/button/Button";
import { ForgotPasswordFormValues } from "../type";
import { forgotPasswordSchema } from "../validations";
import { forgotPassword } from "../api";

type ResetPasswordProps = {
    email: string;
};

function ResetPassword({ email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { isPending, mutate } = useMutation({
        mutationFn: forgotPassword,
        onSuccess: () => {
            toast.success("Password reset successfully.");
            navigate("/signin");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message);
        },
    });

    const formik = useFormik<ForgotPasswordFormValues>({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: forgotPasswordSchema,
        onSubmit: (data) => mutate({ ...data, email }),
    });

    return (
        <AuthLayout>
            <div className="flex flex-col flex-1 w-full max-w-md mx-auto">
                <div className="w-full rounded-2xl border border-gray-200/80 bg-white p-8 shadow-theme-lg sm:p-10">
                    <AuthHeading subtitle="Enter your new password below">
                        Reset your password
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
                                New password <span className="text-error-500">*</span>
                            </Label>
                            <div className="relative mt-1.5">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    name="password"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <Eye className="size-5" />
                                    ) : (
                                        <EyeOff className="size-5" />
                                    )}
                                </button>
                            </div>
                            {formik.errors.password && formik.touched.password && (
                                <p className="mt-1 text-sm text-error-500">
                                    {formik.errors.password}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>
                                Confirm password <span className="text-error-500">*</span>
                            </Label>
                            <div className="relative mt-1.5">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    name="confirmPassword"
                                    onChange={formik.handleChange}
                                    value={formik.values.confirmPassword}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <Eye className="size-5" />
                                    ) : (
                                        <EyeOff className="size-5" />
                                    )}
                                </button>
                            </div>
                            {formik.errors.confirmPassword &&
                                formik.touched.confirmPassword && (
                                    <p className="mt-1 text-sm text-error-500">
                                        {formik.errors.confirmPassword}
                                    </p>
                                )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full py-3 font-medium"
                            size="sm"
                            disabled={isPending}
                        >
                            {isPending ? "Updating..." : "Change password"}
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

export default ResetPassword;
