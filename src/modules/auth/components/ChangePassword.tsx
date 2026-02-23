import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import Label from "../../../components/form/Label";
import AuthLayout from "../../../shared/component/AuthLayout";
import AuthHeading from "../../../shared/component/AuthHeading";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import { resetPasswordSchema } from "../validations";
import { ResetPasswordFormValues } from "../type";
import { resetPassword } from "../api";

function ChangePassword() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { isPending, mutate } = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success("Password updated successfully.");
            navigate("/signin");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message);
        },
    });

    const formik = useFormik<ResetPasswordFormValues>({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: resetPasswordSchema,
        onSubmit: (data) => mutate(data),
    });

    return (
        <AuthLayout>
            <div className="flex flex-col flex-1 w-full max-w-md mx-auto">
                <div className="w-full rounded-2xl border border-gray-200/80 bg-white p-8 shadow-theme-lg sm:p-10">
                    <AuthHeading subtitle="Enter your current password and choose a new one">
                        Reset Password
                    </AuthHeading>
                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div>
                            <Label>
                                Current password <span className="text-error-500">*</span>
                            </Label>
                            <div className="relative mt-1.5">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    name="currentPassword"
                                    onChange={formik.handleChange}
                                    value={formik.values.currentPassword}
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
                            {formik.errors.currentPassword &&
                                formik.touched.currentPassword && (
                                    <p className="mt-1 text-sm text-error-500">
                                        {formik.errors.currentPassword}
                                    </p>
                                )}
                        </div>
                        <div>
                            <Label>
                                New password <span className="text-error-500">*</span>
                            </Label>
                            <div className="relative mt-1.5">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    name="newPassword"
                                    onChange={formik.handleChange}
                                    value={formik.values.newPassword}
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
                            {formik.errors.newPassword && formik.touched.newPassword && (
                                <p className="mt-1 text-sm text-error-500">
                                    {formik.errors.newPassword}
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
                                    placeholder="Confirm new password"
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
                            {isPending ? "Updating..." : "Reset Password"}
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

export default ChangePassword;
