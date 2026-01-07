import { useState } from "react";

import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { AxiosError } from "axios";

import AuthLayout from "../../../pages/AuthPages/AuthLayout";
import { signup } from "../api";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import withoutAuth from "../../../shared/component/withoutAuth";
import { useMutation } from "@tanstack/react-query";
import { signupSchema } from "../validations";
import { SignUpFormValues } from "../type";
import AuthHeading from "../../../pages/AuthPages/AuthHeading";

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    // const [isChecked, setIsChecked] = useState(false);

    const navigate = useNavigate();

    const { isPending, mutate } = useMutation({
        mutationFn: signup,
        onSuccess: () => navigate('/signin'),
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message)
        }
    })

    const formik = useFormik<SignUpFormValues>({
        initialValues: {
            name: "",
            lastName: "",
            email: "",
            password: "",
            phone: ""
        },
        validationSchema: signupSchema,
        validateOnChange: false,
        onSubmit: (data) => mutate(data),
    });

    return (
        <>
            <AuthLayout>
                <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
                    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                        <div>
                            <AuthHeading>
                                Sign Up
                                <p className="text-sm text-gray-500">
                                    Enter your email and password to sign up!
                                </p>
                            </AuthHeading>
                            <div>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            {/* <!-- First Name --> */}
                                            <div className="sm:col-span-1">
                                                <Label>
                                                    First Name<span className="text-error-500">*</span>
                                                </Label>
                                                <Input
                                                    placeholder="Enter your first name"
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.name}
                                                />
                                                {formik.errors.name && formik.touched.name && <p className="text-error-500">{formik.errors.name}</p>}
                                            </div>
                                            {/* <!-- Last Name --> */}
                                            <div className="sm:col-span-1">
                                                <Label>
                                                    Last Name<span className="text-error-500">*</span>
                                                </Label>
                                                <Input
                                                    placeholder="Enter your last name"
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.lastName}
                                                />
                                                {formik.errors.lastName && formik.touched.lastName && <p className="text-error-500">{formik.errors.lastName}</p>}
                                            </div>
                                        </div>
                                        {/* <!-- Email --> */}
                                        <div>
                                            <Label>
                                                Email<span className="text-error-500">*</span>
                                            </Label>
                                            <Input
                                                placeholder="Enter your email"
                                                type="email"
                                                id="email"
                                                name="email"
                                                onChange={formik.handleChange}
                                                value={formik.values.email}
                                            />
                                            {formik.errors.email && formik.touched.email && <p className="text-error-500">{formik.errors.email}</p>}
                                        </div>

                                        <div>
                                            <Label>
                                                Phone Number<span className="text-error-500">*</span>
                                            </Label>
                                            <Input
                                                placeholder="Enter your Phone Number"
                                                name="phone"
                                                onChange={formik.handleChange}
                                                value={formik.values.phone}
                                            />
                                            {formik.errors.phone && formik.touched.phone && <p className="text-error-500">{formik.errors.phone}</p>}
                                        </div>

                                        {/* <!-- Password --> */}
                                        <div>
                                            <Label>
                                                Password<span className="text-error-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter your password"
                                                    type={showPassword ? "text" : "password"}
                                                    id="password"
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
                                        {/* <!-- Checkbox --> */}
                                        {/* <div className="flex items-center gap-3">
                                            <Checkbox
                                                className="w-5 h-5"
                                                checked={isChecked}
                                                onChange={setIsChecked}
                                            />
                                            <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                                                By creating an account means you agree to the{" "}
                                                <span className="text-gray-800 dark:text-white/90">
                                                    Terms and Conditions,
                                                </span>{" "}
                                                and our{" "}
                                                <span className="text-gray-800 dark:text-white">
                                                    Privacy Policy
                                                </span>
                                            </p>
                                        </div> */}
                                        {/* <!-- Button --> */}
                                        <div>
                                            <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                                                {isPending ? "Signing up..." : "Sign Up"}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <div className="mt-5">
                                    <p className="text-sm font-normal text-center text-gray-700 ">
                                        Already have an account? {""}
                                        <Link
                                            to="/signin"
                                            className="text-brand-500 hover:text-brand-600"
                                        >
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        </>
    );
}

export default withoutAuth(SignUp)