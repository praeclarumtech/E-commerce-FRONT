import { Formik, Form, Field } from "formik";
import { Link, useNavigate, useLocation } from "react-router-dom";
import type { AxiosError } from "axios";

import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import SectionFullScreen from "../../_components/Section/FullScreen";
import { verifyOTPSchema } from "../validation";
import { useMutation } from "@tanstack/react-query";
import { verifyRegistrationOtp } from "../api";
import type { VerifyRegistrationOtpPayload } from "../interface";
import { toast } from "../../_lib/toast";

function VerifyRegistrationOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = (location.state as { email?: string } | null)?.email ?? "";

    const { isPending, mutate: verifyFn } = useMutation({
        mutationFn: (payload: VerifyRegistrationOtpPayload) => verifyRegistrationOtp(payload),
        onSuccess: () => {
            toast.success("Email verified successfully. You can sign in now.");
            navigate("/login", { replace: true });
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message ?? "Invalid or expired OTP");
        },
    });

    return (
        <SectionFullScreen bg="dark">
            <div className="dark w-full flex justify-center">
                <CardBox className="w-11/12 max-w-md shadow-2xl">
                    <div className="text-slate-200 [&_input]:text-white [&_input]:placeholder-gray-400 [&_input]:caret-white">
                        <div className="mb-6 sm:mb-8 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Verify your email
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-400">
                                Enter the 6-digit OTP sent to your email to complete registration
                            </p>
                        </div>
                        <Formik
                            initialValues={{
                                email: emailFromState,
                                otp: "",
                            }}
                            validationSchema={verifyOTPSchema}
                            validateOnChange={false}
                            onSubmit={(values) =>
                                verifyFn({
                                    email: values.email.trim(),
                                    otp: values.otp.trim(),
                                })
                            }
                            enableReinitialize
                        >
                            {({ errors }) => (
                                <Form className="space-y-5">
                                    <FormField label="Email *" labelFor="verify-email">
                                        {({ className }) => (
                                            <>
                                                <Field
                                                    name="email"
                                                    type="email"
                                                    id="verify-email"
                                                    placeholder="info@gmail.com"
                                                    className={className}
                                                    readOnly={!!emailFromState}
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-xs text-red-400">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </FormField>

                                    <FormField label="OTP *" labelFor="verify-otp">
                                        {({ className }) => (
                                            <>
                                                <Field
                                                    name="otp"
                                                    type="text"
                                                    id="verify-otp"
                                                    placeholder="Enter 6-digit OTP"
                                                    className={className}
                                                    maxLength={6}
                                                    autoComplete="one-time-code"
                                                />
                                                {errors.otp && (
                                                    <p className="mt-1 text-xs text-red-400">
                                                        {errors.otp}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </FormField>

                                    <Button
                                        type="submit"
                                        label={isPending ? "Verifying..." : "Verify"}
                                        color="info"
                                        className="w-full py-3 font-medium"
                                        disabled={isPending}
                                    />

                                    <p className="mt-6 text-center text-sm text-slate-400">
                                        Already verified?{" "}
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

export default VerifyRegistrationOtp;
