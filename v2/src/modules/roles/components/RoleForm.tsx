import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import FormCheckRadio from "../../_components/FormField/CheckRadio";
import type { RolePayload } from "../api";
import type { RoleResponse } from "../interface";

const roleSchema = yup.object({
    name: yup.string().required("Name is required").trim(),
    isActive: yup.boolean(),
});

export type RoleFormValues = RolePayload;

type Props = {
    initialValues: RoleResponse | null;
    onSubmit: (values: RoleFormValues) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
};

const defaultValues: RoleFormValues = {
    name: "",
    isActive: true,
};

function toFormValues(role: RoleResponse | null): RoleFormValues {
    if (!role) return defaultValues;
    return {
        name: role.name,
        isActive: role.isActive ?? true,
        accessModules: role.accessModules,
    };
}

export default function RoleForm({ initialValues, onSubmit, onCancel, isSubmitting = false }: Props) {
    const values = toFormValues(initialValues);
    const formTitle = initialValues ? "Edit Role" : "Add Role";

    return (
        <CardBox
            footer={
                <Buttons className="!justify-end">
                    <Button
                        type="submit"
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
                validationSchema={roleSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                <Form id="role-form">
                    <FormField label="Name" labelFor="name" help="Role name">
                        {({ className }) => (
                            <Field
                                name="name"
                                id="name"
                                placeholder="e.g. Admin"
                                className={className}
                            />
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