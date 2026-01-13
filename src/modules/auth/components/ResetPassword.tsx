import { useState } from "react";

import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";

import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import AuthLayout from "../../../shared/component/AuthLayout";
import Button from "../../../components/ui/button/Button";
import { ForgotPasswordFormValues } from "../type";
import { forgotPasswordSchema } from "../validations";
import { forgotPassword } from "../api";
import AuthHeading from "../../../shared/component/AuthHeading";

type ForgotPasswordProps = {
    email: string;
}

function ResetPassword({ email }: ForgotPasswordProps) {

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()

    const { mutate } = useMutation({
        mutationFn: forgotPassword,
        onSuccess: () => {
            navigate("/signin");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message)
        }
    })

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
            <div className="flex flex-col flex-1">
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <div>
                        <AuthHeading> Reset your password to access</AuthHeading>
                        <div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="space-y-6">
                                    <div>
                                        <Label>
                                            Email
                                        </Label>
                                        <Input
                                            name="email"
                                            value={email}
                                            disabled={true}
                                        />
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <Label>
                                            Password <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter New password"
                                                name="password"
                                                onChange={formik.handleChange}
                                                value={formik.values.password}
                                            />
                                            {formik.errors.password && formik.touched.password && <p className="text-error-500">{formik.errors.password}</p>}
                                            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                            >
                                                {showPassword ? (
                                                    <Eye />
                                                ) : (
                                                    <EyeOff />
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <Label>
                                            Confirm Password <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Confirm  password"
                                                name="confirmPassword"
                                                onChange={formik.handleChange}
                                                value={formik.values.confirmPassword}
                                            />
                                            {formik.errors.confirmPassword && formik.touched.confirmPassword && <p className="text-error-500">{formik.errors.confirmPassword}</p>}
                                            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                            >
                                                {showPassword ? (
                                                    <Eye />
                                                ) : (
                                                    <EyeOff />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <Button className="w-full" size="sm">
                                            Chamge password
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>

    )
}
export default ResetPassword