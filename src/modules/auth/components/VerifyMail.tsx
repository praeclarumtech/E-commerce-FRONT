import { Link } from "react-router";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";

import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import AuthLayout from "../../../pages/AuthPages/AuthLayout";
import { verifymail } from "../api";
import { VerifyMailFormValues } from "../type";
import { verifyMail } from "../validations";
import AuthHeading from "../../../pages/AuthPages/AuthHeading";

type VerifyMailProps = {
    setStep: any,
    setEmail: any
}

function VerifyMail({ setStep, setEmail }: VerifyMailProps) {

    const { mutate, data } = useMutation({
        mutationFn: verifymail,
        onSuccess: () => {
            setStep(2),
                setEmail(formik.values.email)
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message)
        }
    })

    console.log(data)

    const formik = useFormik<VerifyMailFormValues>({
        initialValues: {
            email: "",
        },
        validationSchema: verifyMail,
        onSubmit: (data) => mutate({ ...data, type: 'email_verify' }),
    });

    return (
        <AuthLayout>
            <div className="flex flex-col flex-1">
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <div>
                        <AuthHeading>Forgot your password and continue</AuthHeading>
                        <div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="space-y-6">
                                    <div>
                                        <Label>
                                            Email <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <Input
                                            placeholder="info@gmail.com"
                                            name="email"
                                            onChange={formik.handleChange}
                                            value={formik.values.email}
                                        />
                                        {formik.errors.email && formik.touched.email && <p className="text-error-500">{formik.errors.email}</p>}
                                    </div>

                                    <div>
                                        <Button className="w-full" size="sm">
                                            Send OTP
                                        </Button>
                                    </div>

                                    <div className="mt-5">
                                        <p className="text-sm font-normal text-center text-gray-700">
                                            Go back to sign in? {""}
                                            <Link
                                                to="/signin"
                                                className="text-brand-500 hover:text-brand-600"
                                            >
                                                Sign In
                                            </Link>
                                        </p>
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
export default VerifyMail