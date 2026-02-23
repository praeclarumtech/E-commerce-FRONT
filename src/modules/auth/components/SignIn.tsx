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

import AuthLayout from "../../../shared/component/AuthLayout";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { signinSchema } from "../validations";
import { signin } from "../api";
import { SignInFormValues, } from "../type";
import AuthHeading from "../../../shared/component/AuthHeading";

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
    <AuthLayout>
      <div className="flex flex-col flex-1 w-full max-w-md mx-auto">
        <div className="w-full rounded-2xl border border-gray-200/80 bg-white p-8 shadow-theme-lg sm:p-10">
          <AuthHeading subtitle="Enter your credentials to access your account">
            Sign In
          </AuthHeading>
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="info@gmail.com"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="mt-1.5"
              />
              {formik.errors.email && formik.touched.email && (
                <p className="mt-1 text-sm text-error-500">{formik.errors.email}</p>
              )}
            </div>
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                </button>
              </div>
              {formik.errors.password && formik.touched.password && (
                <p className="mt-1 text-sm text-error-500">{formik.errors.password}</p>
              )}
            </div>
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-brand-500 transition hover:text-brand-600"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full py-3 font-medium" size="sm" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-brand-500 transition hover:text-brand-600"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default withoutAuth(SignIn)