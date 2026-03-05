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
import { signinSchema } from "../validation";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../_stores/authSlice";
import type { LoginPayload } from "../interface";
import { signin } from "../api";
import { toast } from "../../_lib/toast";

const passwordToggleStyle = {
    button: "absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800",
    iconSize: 22,
    iconClass: "block text-current",
} as const;

function Login() {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const navigate = useNavigate();
    const setToken = useAuth((state) => state.setToken);

    const { isPending, mutate: loginFn } = useMutation({
        mutationFn: (payload: LoginPayload) => signin(payload as LoginPayload),
        onSuccess: (response) => {
            const accessToken = response.data?.data?.tokens?.accessToken;
            if (accessToken) setToken(accessToken);
            navigate("/", { replace: true });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? "Sign in failed");
        }
    })

    return (
        <SectionFullScreen bg="dark">
            <div className="dark w-full flex justify-center">
                <CardBox className="w-11/12 max-w-md shadow-2xl">
                    <div className="text-slate-200 [&_input]:text-white [&_input]:placeholder-gray-400 [&_input]:caret-white">
                        <div className="mb-6 sm:mb-8 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Sign In
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-400">
                                Enter your credentials to access your account
                            </p>
                        </div>
                        <Formik
                            initialValues={{
                                email: "",
                                password: "",
                            }}
                            validationSchema={signinSchema}
                            onSubmit={(values) => {loginFn(values)}}
                            validateOnChange={false}
                            validateOnBlur={false}
                        >
                            {({ errors }) => (
                                <Form className="space-y-5">
                                    <FormField label="Email *" labelFor="email">
                                        {({ className }) => (
                                            <>
                                                <Field
                                                    name="email"
                                                    type="email"
                                                    placeholder="info@gmail.com"
                                                    className={className}
                                                    id="email"
                                                />
                                                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
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
                                                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className={passwordToggleStyle.button}
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                >
                                                    <Icon
                                                        path={showPassword ? mdiEyeOff : mdiEye}
                                                        size={passwordToggleStyle.iconSize}
                                                        className={passwordToggleStyle.iconClass}
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </FormField>

                                    <div className="flex items-center justify-end">
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <Button
                                        type="submit"
                                        label="Sign In"
                                        color="info"
                                        className="w-full py-3 font-medium"
                                        disabled={isPending}
                                    />

                                    <p className="mt-6 text-center text-sm text-slate-400">
                                        Don&apos;t have an account?{" "}
                                        <Link
                                            to="/signup"
                                            className="font-medium text-blue-400 transition hover:text-blue-300"
                                        >
                                            Sign Up
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

export default Login;