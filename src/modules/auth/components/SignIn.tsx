import { useState } from "react";

import { useFormik } from 'formik';
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

import { setCookie } from "../../../shared/utils/auth";
import withoutAuth from "../../../shared/component/withoutAuth";
import { ECOMMERCE_ACCESS_TOKEN, ECOMMERCE_REFERSH_TOKEN } from "../../../shared/constant";

import AuthLayout from "../../../pages/AuthPages/AuthLayout";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { signinSchema } from "../validations";
import { signin } from "../api";
import { SignInFormValues, } from "../type";
import AuthHeading from "../../../pages/AuthPages/AuthHeading";

function SignIn() {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const { isPending, mutate } = useMutation({
    mutationFn: signin,
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response?.data?.data?.tokens;
      setCookie(ECOMMERCE_ACCESS_TOKEN, accessToken);
      setCookie(ECOMMERCE_REFERSH_TOKEN, refreshToken);
      navigate("/");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message)
    }
  })

  const formik = useFormik<SignInFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signinSchema,
    onSubmit: (data) => mutate(data),
  });

  return (
    <>
      <AuthLayout>
        <div className="flex flex-col flex-1">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <AuthHeading>Sign In</AuthHeading>
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
                      <Label>
                        Password <span className="text-error-500">*</span>{" "}
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
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
                    <div className="flex items-center justify-end">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-brand-500 hover:text-brand-600"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div>
                      <Button className="w-full" size="sm">
                        {isPending ? "Signing in..." : "Sign In"}
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-gray-700">
                    Don&apos;t have an account? {""}
                    <Link
                      to="/signup"
                      className="text-brand-500 hover:text-brand-600"
                    >
                      Sign Up
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

export default withoutAuth(SignIn)