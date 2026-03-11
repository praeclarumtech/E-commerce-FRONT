import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import { getProfile, updateProfile, type ProfileResponse, type ProfileUpdatePayload } from "../../users/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../_lib/toast";
import type { AxiosError } from "axios";
import { useMainStore } from "../../_stores/mainSlice";

const profileSchema = yup.object({
  firstName: yup.string().min(2, "At least 2 characters").max(50, "Too long").required("First name is required").trim(),
  lastName: yup.string().min(2, "At least 2 characters").max(50, "Too long").required("Last name is required").trim(),
  email: yup.string().email("Invalid email").required("Email is required").trim(),
  phone: yup.string().required("Phone is required").trim(),
});

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

export default function ProfileForm() {
  const queryClient = useQueryClient();
  const setUser = useMainStore((s) => s.setUser);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    select: (res) => (res.data as { data?: ProfileResponse }).data ?? res.data,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => updateProfile(payload),
    onSuccess: (_, variables) => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setUser({
        name: `${variables.firstName} ${variables.lastName}`.trim(),
        email: variables.email,
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update profile");
    },
  });

  const profile = profileData as ProfileResponse | undefined;

  useEffect(() => {
    if (profile) {
      const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || undefined;
      const email = profile.email as string | undefined;
      if (name || email) setUser({ name: name ?? "", email: email ?? "" });
    }
  }, [profile, setUser]);

  const defaultValues: FormValues = profile
    ? {
        firstName: (profile.firstName as string) ?? "",
        lastName: (profile.lastName as string) ?? "",
        email: (profile.email as string) ?? "",
        phone: (profile.phone as string) ?? "",
      }
    : initialValues;

  if (isLoading) {
    return (
      <CardBox>
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
        </div>
      </CardBox>
    );
  }

  return (
    <CardBox
      className="flex-1"
      footer={
        <Buttons className="!justify-end">
          <Button type="submit" form="profile-form" label="Save profile" color="info" isGrouped />
        </Buttons>
      }
    >
      <h3 className="mb-4 text-lg font-semibold">Profile details</h3>
      <Formik
        initialValues={defaultValues}
        validationSchema={profileSchema}
        enableReinitialize
        validateOnChange={false}
        onSubmit={(values) => {
          updateMutation.mutate({
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
          });
        }}
      >
        <Form id="profile-form" className="flex flex-1 flex-col">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="First name *" labelFor="firstName">
              {({ className }) => (
                <>
                  <Field name="firstName" id="firstName" placeholder="First name" className={className} />
                  <ErrorMessage name="firstName" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
                </>
              )}
            </FormField>
            <FormField label="Last name *" labelFor="lastName">
              {({ className }) => (
                <>
                  <Field name="lastName" id="lastName" placeholder="Last name" className={className} />
                  <ErrorMessage name="lastName" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
                </>
              )}
            </FormField>
            <FormField label="Email *" labelFor="email">
              {({ className }) => (
                <>
                  <Field name="email" id="email" type="email" placeholder="you@example.com" className={className} />
                  <ErrorMessage name="email" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
                </>
              )}
            </FormField>
            <FormField label="Phone *" labelFor="phone">
              {({ className }) => (
                <>
                  <Field name="phone" id="phone" placeholder="Phone number" className={className} />
                  <ErrorMessage name="phone" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
                </>
              )}
            </FormField>
          </div>
        </Form>
      </Formik>
    </CardBox>
  );
}
