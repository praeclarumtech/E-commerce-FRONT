import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { createUser } from "../api";
import { addUserSchema } from "../validations";
import { AddUserFormValues } from "../type";

const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
];

function AddUser() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { isPending, mutate } = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            toast.success("User created successfully!");
            navigate('/users');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to create user");
        }
    });

    const formik = useFormik<AddUserFormValues>({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
            gender: "",
        },
        validationSchema: addUserSchema,
        validateOnChange: false,
        onSubmit: (data) => {
            mutate({
                ...data,
                role: "admin", // Static role
            });
        },
    });

    return (
        <div className="h-full overflow-y-auto">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Add New User</h2>
                <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new user.</p>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* First Name */}
                    <div>
                        <Label>
                            First Name<span className="text-error-500">*</span>
                        </Label>
                        <Input
                            placeholder="Enter first name"
                            type="text"
                            name="firstName"
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                        />
                        {formik.errors.firstName && formik.touched.firstName && (
                            <p className="text-error-500 text-sm mt-1">{formik.errors.firstName}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <Label>
                            Last Name<span className="text-error-500">*</span>
                        </Label>
                        <Input
                            placeholder="Enter last name"
                            type="text"
                            name="lastName"
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                        />
                        {formik.errors.lastName && formik.touched.lastName && (
                            <p className="text-error-500 text-sm mt-1">{formik.errors.lastName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <Label>
                            Email<span className="text-error-500">*</span>
                        </Label>
                        <Input
                            placeholder="Enter email"
                            type="email"
                            name="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                        />
                        {formik.errors.email && formik.touched.email && (
                            <p className="text-error-500 text-sm mt-1">{formik.errors.email}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <Label>
                            Phone Number<span className="text-error-500">*</span>
                        </Label>
                        <Input
                            placeholder="Enter phone number"
                            name="phone"
                            onChange={formik.handleChange}
                            value={formik.values.phone}
                        />
                        {formik.errors.phone && formik.touched.phone && (
                            <p className="text-error-500 text-sm mt-1">{formik.errors.phone}</p>
                        )}
                    </div>

                    {/* Gender */}
                    <div>
                        <Label>
                            Gender<span className="text-error-500">*</span>
                        </Label>
                        <Select
                            name="gender"
                            options={genderOptions}
                            placeholder="Select gender"
                            value={formik.values.gender}
                            onChange={(value) => formik.setFieldValue("gender", value)}
                        />
                        {formik.errors.gender && formik.touched.gender && (
                            <p className="text-error-500 text-sm mt-1">{formik.errors.gender}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <Label>
                            Password<span className="text-error-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                placeholder="Enter password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                            >
                                {showPassword ? <Eye /> : <EyeOff />}
                            </span>
                        </div>
                        {formik.errors.password && formik.touched.password && (
                            <p className="text-error-500 text-sm mt-1">{formik.errors.password}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/users')}
                            className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 transition rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </div>
            </form>
            </div>
        </div>
    );
}

export default AddUser;
