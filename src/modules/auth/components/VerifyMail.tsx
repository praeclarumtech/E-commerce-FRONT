import { Link } from "react-router";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";

import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import AuthLayout from "../../../shared/component/AuthLayout";
import AuthHeading from "../../../shared/component/AuthHeading";
import { verifymail } from "../api";
import { VerifyMailFormValues } from "../type";
import { verifyMail } from "../validations";

type VerifyMailProps = {
    setStep: (step: number) => void;
    setEmail: (email: string) => void;
};

function VerifyMail({ setStep, setEmail }: VerifyMailProps) {
    const { isPending, mutate } = useMutation({
        mutationFn: verifymail,
        onSuccess: (_, variables) => {
            setStep(2);
            setEmail(variables.email);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message);
        },
    });

    const formik = useFormik<VerifyMailFormValues>({
        initialValues: {
            email: "",
        },
        validationSchema: verifyMail,
        onSubmit: (data) => mutate({ ...data, type: "email_verify" }),
    });

    return (
        <AuthLayout>
            <div className="flex flex-col flex-1 w-full max-w-md mx-auto">
                <div className="w-full rounded-2xl border border-gray-200/80 bg-white p-8 shadow-theme-lg sm:p-10">
                    <AuthHeading subtitle="Enter your email and we'll send you a code to reset your password">
                        Forgot your password?
                    </AuthHeading>
                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div>
                            <Label>
                                Email <span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="info@gmail.com"
                                name="email"
                                type="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                className="mt-1.5"
                            />
                            {formik.errors.email && formik.touched.email && (
                                <p className="mt-1 text-sm text-error-500">{formik.errors.email}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full py-3 font-medium"
                            size="sm"
                            disabled={isPending}
                        >
                            {isPending ? "Sending..." : "Send OTP"}
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

export default VerifyMail;
