import { useState } from "react"

import { useFormik } from "formik"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { AxiosError } from "axios"

import Label from "../../../components/form/Label"
import AuthLayout from "../../../pages/AuthPages/AuthLayout"
import Button from "../../../components/ui/button/Button"
import { resetPasswordSchema } from "../validations"
import Input from "../../../components/form/input/InputField"
import { ResetPasswordFormValues } from "../type"
import { resetPassword } from "../api"

function ChangePassword() {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()

    const { mutate } = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            navigate("/");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message)
        }
    })


    const formik = useFormik<ResetPasswordFormValues>({
        initialValues: {
            // email: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: resetPasswordSchema,
        onSubmit: (data) => mutate(data),
    });

    return (
        <AuthLayout>
            <div className="flex flex-col flex-1">
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <div>
                        <div className="mb-5 sm:mb-8">
                            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm">
                                Reset Password
                            </h1>
                        </div>
                        <div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="space-y-6">


                                    {/* New Password */}
                                    <div>
                                        <Label>
                                            New Password <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter New password"
                                                name="newPassword"
                                                onChange={formik.handleChange}
                                                value={formik.values.newPassword}
                                            />
                                            {formik.errors.newPassword && formik.touched.newPassword && <p className="text-error-500">{formik.errors.newPassword}</p>}

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
                                            Reset Password
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

export default ChangePassword