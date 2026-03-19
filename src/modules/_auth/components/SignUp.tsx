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
import { signupSchema } from "../validation";
import { useMutation } from "@tanstack/react-query";
import { register as registerApi } from "../api";
import type { RegisterPayload } from "../interface";
import { toast } from "../../_lib/toast";

const passwordToggleStyle = {
    button: "absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800",
    iconSize: 22,
    iconClass: "block text-current",
} as const;

function SignUp() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();

    const { isPending, mutate: registerFn } = useMutation({
        mutationFn: (payload: RegisterPayload) => registerApi(payload),
        onSuccess: (_, variables) => {
            toast.success("Account created. Check your email for the OTP to verify.");
            navigate("/verify-registration-otp", { replace: true, state: { email: variables.email } });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? "Registration failed");
        },
    });

    return (
        <SectionFullScreen bg="dark">
            <div className="dark w-full flex justify-center">
                <CardBox className="w-11/12 max-w-md shadow-2xl">
                    <div className="text-slate-200 [&_input]:text-white [&_input]:placeholder-gray-400 [&_input]:caret-white [&_select]:text-white">
                        <div className="mb-6 sm:mb-8 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Sign Up
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-400">
                                Enter your details to create your account
                            </p>
                        </div>
                        <Formik
                            initialValues={{
                                firstName: "",
                                lastName: "",
                                email: "",
                                phone: "",
                                role: "user",
                                password: "",
                            }}
                            validationSchema={signupSchema}
                            validateOnChange={false}
                            onSubmit={(values) => registerFn(values as RegisterPayload)}
                        >
                            {({ errors }) => (
                                <Form>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <FormField label="First Name *" labelFor="firstName">
                                            {({ className }) => (
                                                <>
                                                    <Field
                                                        name="firstName"
                                                        id="firstName"
                                                        placeholder="First name"
                                                        className={className}
                                                    />
                                                    {errors.firstName && (
                                                        <p className="mt-1 text-xs text-red-400">
                                                            {errors.firstName}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </FormField>
                                        <FormField label="Last Name *" labelFor="lastName">
                                            {({ className }) => (
                                                <>
                                                    <Field
                                                        name="lastName"
                                                        id="lastName"
                                                        placeholder="Last name"
                                                        className={className}
                                                    />
                                                    {errors.lastName && (
                                                        <p className="mt-1 text-xs text-red-400">
                                                            {errors.lastName}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </FormField>
                                    </div>

                                    <FormField label="Email *" labelFor="email">
                                        {({ className }) => (
                                            <>
                                                <Field
                                                    name="email"
                                                    type="email"
                                                    id="email"
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

                                    <FormField label="Phone Number *" labelFor="phone">
                                        {({ className }) => (
                                            <>
                                                <Field
                                                    name="phone"
                                                    id="phone"
                                                    placeholder="Enter your phone number"
                                                    className={className}
                                                />
                                                {errors.phone && (
                                                    <p className="mt-1 text-xs text-red-400">
                                                        {errors.phone}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </FormField>
                                    <FormField label="Role *" labelFor="role">
                                        {({ className }) => (
                                            <>
                                                <Field as="select" name="role" id="role" className={className}>
                                                    <option value="user">User</option>
                                                    <option value="seller">Seller</option>
                                                </Field>
                                                {errors.role && (
                                                    <p className="mt-1 text-xs text-red-400">
                                                        {errors.role}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </FormField>
                                    <FormField label="Password *" labelFor="password">
                                        {({ className }) => (
                                            <div className="relative">
                                                <Field
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    className={`${className} pr-10`}
                                                    id="password"
                                                />
                                                {errors.password && (
                                                    <p className="mt-1 text-xs text-red-400">
                                                        {errors.password}
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

                                    <Button
                                        type="submit"
                                        label="Sign Up"
                                        color="info"
                                        className="w-full py-3 font-medium"
                                        disabled={isPending}
                                    />

                                    <p className="mt-6 text-center text-sm text-slate-400">
                                        Already have an account?{" "}
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

export default SignUp;
