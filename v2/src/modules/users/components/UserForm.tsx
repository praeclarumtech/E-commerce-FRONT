import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import FormCheckRadio from "../../_components/FormField/CheckRadio";
import { get as getRoles } from "../../roles/api";
import { createUser, getUserById, updateUser, type UserPayload } from "../api";
import type { UserResponse } from "../interface";
import { toast } from "../../_lib/toast";

const userSchema = yup.object({
  firstName: yup.string().required("First name is required").trim(),
  lastName: yup.string().required("Last name is required").trim(),
  email: yup.string().email("Invalid email").required("Email is required").trim(),
  phone: yup.string().required("Phone is required").trim(),
  gender: yup.string().nullable().optional(),
  dob: yup.string().nullable().optional(),
  password: yup.string().when("$isEdit", {
    is: false,
    then: (schema) => schema.required("Password is required").min(6, "Min 6 characters"),
    otherwise: (schema) => schema.min(6, "Min 6 characters").optional(),
  }),
  roleId: yup.string().optional(),
  isActive: yup.boolean(),
});

function formatDobForInput(dob: string | null | undefined): string {
  if (!dob) return "";
  const date = dob.split("T")[0];
  return date?.length === 10 ? date : "";
}

export default function UserForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const { data: rolesData } = useQuery({
    queryKey: ["roles-list"],
    queryFn: () => getRoles({ params: { limit: 100 } }),
    select: (res) => res.data?.data ?? res.data ?? [],
  });

  const { data: userData, isLoading: isLoadingUser, isError: isUserError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id!),
    enabled: isEditMode,
    select: (response) => (response.data as { data?: UserResponse }).data ?? response.data,
  });

  const { isPending: isCreating, mutate: createMutate } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to create user");
    },
  });

  const { isPending: isUpdating, mutate: updateMutate } = useMutation({
    mutationFn: ({ id: userId, payload }: { id: string; payload: Partial<UserPayload> }) =>
      updateUser(userId, payload),
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      navigate("/users");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update user");
    },
  });

  const isPending = isCreating || isUpdating;

  if (isEditMode && isLoadingUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
      </div>
    );
  }

  if (isEditMode && isUserError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-gray-600 dark:text-slate-400">User not found or you don&apos;t have access.</p>
        <Button
          type="button"
          label="← Back to Users"
          color="whiteDark"
          outline
          onClick={() => navigate("/users")}
        />
      </div>
    );
  }

  const initialValues = {
    firstName: userData?.firstName ?? "",
    lastName: userData?.lastName ?? "",
    email: userData?.email ?? "",
    phone: userData?.phone ?? "",
    gender: userData?.gender ?? null,
    dob: userData?.dob ? formatDobForInput(userData.dob) : null,
    password: "",
    roleId: userData?.role?._id ?? userData?.roleId ?? "",
    isActive: userData?.isActive ?? true,
  };

  const formTitle = isEditMode ? "Edit User" : "Add User";

  return (
    <div className="h-full overflow-y-auto">
      <CardBox
        footer={
          <Buttons className="!justify-between">
            <Button
              type="button"
              label={isEditMode ? "← Back to Users" : "Cancel"}
              color="whiteDark"
              outline
              onClick={() => navigate("/users")}
              isGrouped
            />
            <Buttons className="!justify-end">
              <Button
                type="submit"
                form="user-form"
                label="Save"
                color="info"
                disabled={isPending}
                isGrouped
              />
            </Buttons>
          </Buttons>
        }
      >
        <h2 className="mb-4 text-lg font-semibold">{formTitle}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={userSchema}
          enableReinitialize
          validateOnChange={false}
          context={{ isEdit: isEditMode }}
          onSubmit={(v) => {
            const payload: UserPayload = {
              firstName: v.firstName,
              lastName: v.lastName,
              email: v.email,
              phone: v.phone,
              gender: v.gender ?? undefined,
              dob: v.dob ?? undefined,
              roleId: v.roleId || undefined,
              isActive: v.isActive,
            };
            if (!isEditMode) payload.password = v.password;
            if (isEditMode && v.password) payload.password = v.password;
            if (isEditMode) {
              updateMutate({ id: id!, payload });
            } else {
              createMutate(payload);
            }
          }}
        >
          <Form id="user-form">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="First Name *" labelFor="firstName">
                {({ className }) => (
                  <Field
                    name="firstName"
                    id="firstName"
                    placeholder="First name"
                    className={className}
                  />
                )}
              </FormField>
              <FormField label="Last Name *" labelFor="lastName">
                {({ className }) => (
                  <Field
                    name="lastName"
                    id="lastName"
                    placeholder="Last name"
                    className={className}
                  />
                )}
              </FormField>
              <FormField label="Email *" labelFor="email" help="Email address">
                {({ className }) => (
                  <Field
                    name="email"
                    id="email"
                    type="email"
                    placeholder="e.g. john@example.com"
                    className={className}
                    disabled={isEditMode}
                  />
                )}
              </FormField>
              <FormField label="Phone *" labelFor="phone" help="Phone number">
                {({ className }) => (
                  <Field name="phone" id="phone" placeholder="e.g. 9876543210" className={className} />
                )}
              </FormField>
              <FormField label="Gender" labelFor="gender">
                {({ className }) => (
                  <Field as="select" name="gender" id="gender" className={className}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Field>
                )}
              </FormField>
              <FormField label="Date of Birth" labelFor="dob">
                {({ className }) => (
                  <Field name="dob" id="dob" type="date" className={className} />
                )}
              </FormField>
              <FormField
                label="Password"
                labelFor="password"
                help={isEditMode ? "Leave blank to keep current" : "Min 6 characters"}
              >
                {({ className }) => (
                  <Field
                    name="password"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={className}
                  />
                )}
              </FormField>
              <FormField label="Role" labelFor="roleId">
                {({ className }) => (
                  <Field as="select" name="roleId" id="roleId" className={className}>
                    <option value="">Select role</option>
                    {rolesData?.items?.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name}
                      </option>
                    ))}
                  </Field>
                )}
              </FormField>
            </div>
            <div className="mt-4">
              <FormCheckRadio type="switch" label="Active">
                <Field type="checkbox" name="isActive" />
              </FormCheckRadio>
            </div>
          </Form>
        </Formik>
      </CardBox>
    </div>
  );
}
