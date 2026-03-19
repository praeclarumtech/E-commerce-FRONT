import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";

import Button from "../../_components/Button";
import CardBox from "../../_components/CardBox";
import SectionFullScreen from "../../_components/Section/FullScreen";
import { verifyEmail } from "../api";
import { toast } from "../../_lib/toast";

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            toast.error("Invalid verification link. No token provided.");
            return;
        }
        setStatus("loading");
        verifyEmail({ token })
            .then(() => {
                setStatus("success");
                toast.success("Email verified successfully.");
            })
            .catch((error: AxiosError<{ message?: string }>) => {
                setStatus("error");
                toast.error(error.response?.data?.message ?? "Verification failed or link expired.");
            });
    }, [token]);

    return (
        <SectionFullScreen bg="dark">
            <div className="dark w-full flex justify-center">
                <CardBox className="w-11/12 max-w-md shadow-2xl">
                    <div className="text-slate-200 text-center">
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Verify your email
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-400">
                                {status === "loading" && "Verifying your email..."}
                                {status === "success" && "Your email has been verified. You can sign in now."}
                                {status === "error" && "This link is invalid or has expired."}
                                {status === "idle" && "Please wait..."}
                            </p>
                        </div>

                        {status === "loading" && (
                            <div className="flex justify-center py-6">
                                <div className="h-10 w-10 animate-spin rounded-full border-2 border-b-blue-500 border-slate-600" />
                            </div>
                        )}

                        {(status === "success" || status === "error") && (
                            <Link to="/login">
                                <Button
                                    type="button"
                                    label="Go to Sign In"
                                    color="info"
                                    className="w-full py-3 font-medium"
                                />
                            </Link>
                        )}
                    </div>
                </CardBox>
            </div>
        </SectionFullScreen>
    );
}

export default VerifyEmail;
