import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useUser } from "../../context/UserDataContext";
import { UpdateUserDataFormValues } from "../../modules/auth/type";
import { updateUserData } from "../../modules/auth/api";
import profileSchema from "../../modules/profile/validation";

export default function UserInfoCard() {

  const { user, refetch } = useUser()

  const { mutate, isPending } = useMutation({
    mutationFn: updateUserData,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      refetch();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  })

  const formik = useFormik<UpdateUserDataFormValues>({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || ""
    },
    validationSchema:profileSchema,
    enableReinitialize:true,
    onSubmit: (data) => mutate(data),
  });

  return (
    <div className="p-5 border border-gray-200 rounded-2xl">
      <div className="flex flex-col gap-6 lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 ">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500">
                First Name<span className="text-error-500">*</span>
              </p>
              <Input
                className="text-sm font-medium text-gray-80"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
              />
              {formik.errors.firstName && formik.touched.firstName && <p className="text-error-500">{formik.errors.firstName}</p>}
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500">
                Last Name<span className="text-error-500">*</span>
              </p>
              <Input
                className="text-sm font-medium text-gray-800"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
              />
              {formik.errors.lastName && formik.touched.lastName && <p className="text-error-500">{formik.errors.lastName}</p>}
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500">
                Email address
              </p>
              <Input
                className="text-sm font-medium text-gray-800"
                name="email"
                value={formik.values.email}
                // readOnly
                disabled={true}
              />
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500">
                Phone<span className="text-error-500">*</span>
              </p>
              <Input
                className="text-sm font-medium text-gray-800"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange} />
                {formik.errors.phone && formik.touched.phone && <p className="text-error-500">{formik.errors.phone}</p>}
            </div>
            <Button size="sm" className="w-25" onClick={() => formik.handleSubmit()}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}