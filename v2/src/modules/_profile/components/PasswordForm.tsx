import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import { changePassword } from "../../users/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "../../_lib/toast";
import type { AxiosError } from "axios";

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().min(6, "At least 6 characters").required("New password is required"),
  newPasswordConfirmation: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm new password"),
});

type FormValues = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

const initialValues: FormValues = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirmation: "",
};

export default function PasswordForm() {
  const mutation = useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      changePassword({ currentPassword: payload.currentPassword, newPassword: payload.newPassword }),
    onSuccess: () => {
      toast.success("Password updated successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to change password");
    },
  });

  return (
    <CardBox
      footer={
        <Buttons className="!justify-end">
          <Button type="submit" form="password-form" label="Change password" color="info" isGrouped disabled={mutation.isPending} />
        </Buttons>
      }
    >
      <h3 className="mb-4 text-lg font-semibold">Change password</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={passwordSchema}
        validateOnChange={false}
        onSubmit={(values) => {
          mutation.mutate({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          });
        }}
      >
        <Form id="password-form" className="flex flex-1 flex-col">
          <FormField label="Current password" labelFor="currentPassword">
            {({ className }) => (
              <>
                <Field
                  name="currentPassword"
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={className}
                />
                <ErrorMessage name="currentPassword" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
              </>
            )}
          </FormField>
          <FormField label="New password" labelFor="newPassword">
            {({ className }) => (
              <>
                <Field
                  name="newPassword"
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={className}
                />
                <ErrorMessage name="newPassword" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
              </>
            )}
          </FormField>
          <FormField label="Confirm new password" labelFor="newPasswordConfirmation">
            {({ className }) => (
              <>
                <Field
                  name="newPasswordConfirmation"
                  id="newPasswordConfirmation"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={className}
                />
                <ErrorMessage name="newPasswordConfirmation" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
              </>
            )}
          </FormField>
        </Form>
      </Formik>
    </CardBox>
  );
}
