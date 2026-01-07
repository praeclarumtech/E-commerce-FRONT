import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import OTPInput from "react-otp-input";

import AuthLayout from "../../../pages/AuthPages/AuthLayout";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { verifyOTP } from "../api";
import { VerifyOTPFormValues } from "../type";
import AuthHeading from "../../../pages/AuthPages/AuthHeading";

type VerifyOTPProps = {
    setStep: any
    email: string
}

function VerifyOTP({ setStep, email }: VerifyOTPProps) {


    const { mutate: verifyOtpFn } = useMutation({
        mutationFn: verifyOTP,
        onSuccess: () => {
            setStep(3)
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message)
        }
    })

    const formik = useFormik<VerifyOTPFormValues>({
        initialValues: {
            email: email,
            otp: "",
        },
        onSubmit: (data) => verifyOtpFn({ ...data, otp: Number(data.otp) }),
    });

    return (
        <AuthLayout>
            <div className="flex flex-col flex-1">
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <div>
                        <AuthHeading>Verify your mail</AuthHeading>
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
                                        {formik.errors.email && (
                                            <p className="text-error-500">{formik.errors.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>
                                            OTP <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <OTPInput
                                            value={formik.values.otp}
                                            onChange={(value) => formik.setFieldValue('otp', value)}
                                            numInputs={4}
                                            inputStyle={{
                                                width: '3rem',
                                                height: '3rem',
                                                margin: '20px 1rem',
                                                fontSize: '1rem',
                                                borderRadius: 4,
                                                border: '2px solid rgba(0,0,0,0.3)',
                                            }}
                                            renderInput={(props) => <input {...props} />}
                                        />
                                        {formik.errors.otp && <p className="text-error-500">{formik.errors.otp}</p>}
                                    </div>
                                    <Button className="w-full" size="sm">
                                        Verify OTP
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </AuthLayout >
    )
}
export default VerifyOTP