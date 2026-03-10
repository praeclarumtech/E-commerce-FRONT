import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import FormCheckRadio from "../../_components/FormField/CheckRadio";
import type { UserPayload } from "../api";
import type { UserResponse } from "../interface";
import { useQuery } from "@tanstack/react-query";
import { get as getRoles } from "../../roles/api";

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

export type UserFormValues = UserPayload;

type Props = {
    initialValues: UserResponse | null;
    onSubmit: (values: UserFormValues) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
};

const defaultValues: UserFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: null,
    dob: null,
    isActive: true,
};

function formatDobForInput(dob: string | null | undefined): string {
    if (!dob) return "";
    const date = dob.split("T")[0];
    return date?.length === 10 ? date : "";
}

function toFormValues(user: UserResponse | null): UserFormValues {
    if (!user) return defaultValues;
    return {
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        gender: user.gender ?? null,
        dob: user.dob ? formatDobForInput(user.dob) : null,
        password: "",
        roleId: user.role?._id ?? user.roleId ?? "",
        isActive: user.isActive ?? true,
    };
}

export default function UserForm({ initialValues, onSubmit, onCancel, isSubmitting = false }: Props) {
    const values = toFormValues(initialValues);
    const formTitle = initialValues ? "Edit User" : "Add User";
    const isEdit = !!initialValues;

    const { data: rolesData } = useQuery({
        queryKey: ['roles-list'],
        queryFn: () => getRoles({ params: { limit: 100 } }),
        select: (res) => res.data?.data ?? res.data ?? [],
    });

    return (
        <CardBox
            footer={
                <Buttons className="!justify-end">
                    <Button
                        type="submit"
                        form="user-form"
                        label="Save"
                        color="info"
                        disabled={isSubmitting}
                        isGrouped
                    />
                    <Button
                        type="button"
                        label="Cancel"
                        color="whiteDark"
                        outline
                        onClick={onCancel}
                        isGrouped
                    />
                </Buttons>
            }
        >
            <h2 className="mb-4 text-lg font-semibold">{formTitle}</h2>
            <Formik
                initialValues={values}
                validationSchema={userSchema}
                onSubmit={(v) => {
                    const payload = { ...v };
                    if (isEdit && !payload.password) delete payload.password;
                    onSubmit(payload);
                }}
                enableReinitialize
                context={{ isEdit }}
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
                    </div>
                    <FormField label="Email *" labelFor="email" help="Email address">
                        {({ className }) => (
                            <Field
                                name="email"
                                id="email"
                                type="email"
                                placeholder="e.g. john@example.com"
                                className={className}
                                disabled={isEdit}
                            />
                        )}
                    </FormField>
                    <FormField label="Phone *" labelFor="phone" help="Phone number">
                        {({ className }) => (
                            <Field
                                name="phone"
                                id="phone"
                                placeholder="e.g. 9876543210"
                                className={className}
                            />
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
                            <Field
                                name="dob"
                                id="dob"
                                type="date"
                                className={className}
                            />
                        )}
                    </FormField>
                    <FormField
                        label="Password"
                        labelFor="password"
                        help={isEdit ? "Leave blank to keep current" : "Min 6 characters"}
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
                                {rolesData?.data?.map((r) => (
                                    <option key={r._id} value={r._id}>
                                        {r.name}
                                    </option>
                                ))}
                            </Field>
                        )}
                    </FormField>
                    <FormCheckRadio type="switch" label="Active">
                        <Field type="checkbox" name="isActive" />
                    </FormCheckRadio>
                </Form>
            </Formik>
        </CardBox>
    );
}