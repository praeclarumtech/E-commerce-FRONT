import { useState } from "react";

import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { AxiosError } from "axios";

import AuthLayout from "../../../shared/component/AuthLayout";
import Button from "../../../components/ui/button/Button";
import { signup } from "../api";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import withoutAuth from "../../../shared/component/withoutAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signupSchema } from "../validations";
import { SignUpFormValues } from "../type";
import AuthHeading from "../../../shared/component/AuthHeading";
import { getAllRoles } from "../../roles/api";
import { Role } from "../../roles/type";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Fetch roles for dropdown - excluding admin role
  const { data: roles = [] } = useQuery({
    queryKey: ["roles-dropdown"],
    queryFn: getAllRoles,
    select: (response) => {
      const allRoles: Role[] = response.data.data?.items || [];
      // Filter out admin role for signup
      return allRoles
        .filter((role) => role.name.toLowerCase() !== "admin" && role.isActive)
        .map((role) => ({ value: role._id, label: role.name }));
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: signup,
    onSuccess: (_, variables) => {
      navigate("/verify-otp", { state: { email: variables.email } });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const formik = useFormik<SignUpFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      role: "",
    },
    validationSchema: signupSchema,
    validateOnChange: false,
    onSubmit: (data) => mutate(data),
  });

  return (
    <AuthLayout>
      <div className="flex flex-col flex-1 w-full max-w-lg mx-auto py-6">
        <div className="w-full max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border border-gray-200/80 bg-white p-8 md:p-8 lg:p-8 shadow-theme-lg sm:p-10 no-scrollbar">
          <AuthHeading subtitle="Enter your details to create your account">
            Sign Up
          </AuthHeading>
          <form onSubmit={formik.handleSubmit} className="space-y-2" noValidate>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label>
                  First Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Enter your first name"
                  type="text"
                  name="firstName"
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  className="mt-1.5"
                />
                {formik.errors.firstName && formik.touched.firstName && (
                  <p className="mt-1 text-sm text-error-500">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <Label>
                  Last Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Enter your last name"
                  type="text"
                  name="lastName"
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  className="mt-1.5"
                />
                {formik.errors.lastName && formik.touched.lastName && (
                  <p className="mt-1 text-sm text-error-500">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="info@gmail.com"
                type="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="mt-1.5"
              />
              {formik.errors.email && formik.touched.email && (
                <p className="mt-1 text-sm text-error-500">
                  {formik.errors.email}
                </p>
              )}
            </div>
            <div>
              <Label>
                Phone Number <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="Enter your phone number"
                name="phone"
                onChange={formik.handleChange}
                value={formik.values.phone}
                className="mt-1.5"
              />
              {formik.errors.phone && formik.touched.phone && (
                <p className="mt-1 text-sm text-error-500">
                  {formik.errors.phone}
                </p>
              )}
            </div>
            <div>
              <Label>
                Role <span className="text-error-500">*</span>
              </Label>
              <div className="mt-1.5">
                <Select
                  name="role"
                  options={roles}
                  placeholder="Select your role"
                  value={formik.values.role}
                  onChange={(value) => formik.setFieldValue("role", value)}
                />
              </div>
              {formik.touched.role &&
                typeof formik.errors.role === "string" && (
                  <p className="mt-1 text-sm text-error-500">
                    {formik.errors.role}
                  </p>
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
                  {showPassword ? (
                    <Eye className="size-5" />
                  ) : (
                    <EyeOff className="size-5" />
                  )}
                </button>
              </div>
              {formik.errors.password && formik.touched.password && (
                <p className="mt-1 text-sm text-error-500">
                  {formik.errors.password}
                </p>
              )}
            </div>
            <div className="pt-3">
            <Button
              type="submit"
              className="w-full py-3 font-medium"
              size="sm"
              disabled={isPending}
            >
              {isPending ? "Signing up..." : "Sign Up"}
            </Button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
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

export default withoutAuth(SignUp);
