import { useState } from "react"

import VerifyMail from "./VerifyMail";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";

function ForgotPassword() {

    const [email, setEmail] = useState('');

    const [step, setStep] = useState(1)

    return (
        <>
            {step === 1 && <VerifyMail setStep={setStep} setEmail={setEmail} />}
            {step === 2 && <VerifyOTP setStep={setStep} email={email} />}
            {step === 3 && <ResetPassword email={email} />}
        </>

    )
}

export default ForgotPassword