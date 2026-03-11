import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import FormCheckRadio from "../../_components/FormField/CheckRadio";
import { createService, getServiceById, updateService } from "../api";
import { serviceSchema } from "../validations";
import type { Service, CreateServiceParams } from "../interface";
import { toast } from "../../_lib/toast";

type FormValues = {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
  isActive: boolean;
};

const initialValues: FormValues = {
  key: "",
  title: "",
  subtitle: "",
  icon: "",
  isActive: true,
};

export default function ServiceForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const { data: serviceData, isLoading: isLoadingService } = useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id!),
    enabled: isEditMode,
    select: (response) => (response.data as { data?: Service }).data ?? response.data,
  });

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      toast.success("Service created successfully!");
      queryClient.invalidateQueries({ queryKey: ["services"] });
      navigate("/services");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to create service");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id: serviceId, data: payload }: { id: string; data: CreateServiceParams }) =>
      updateService(serviceId, payload),
    onSuccess: () => {
      toast.success("Service updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["service", id] });
      navigate("/services");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update service");
    },
  });

  if (isEditMode && isLoadingService) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
      </div>
    );
  }

  const defaultValues: FormValues = serviceData
    ? {
        key: (serviceData.key as string) ?? "",
        title: (serviceData.title as string) ?? "",
        subtitle: (serviceData.subtitle as string) ?? "",
        icon: (serviceData.icon as string) ?? "",
        isActive: serviceData.isActive !== false,
      }
    : initialValues;

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="h-full overflow-y-auto">
      <CardBox
        footer={
          <Buttons className="!justify-between">
            <Button
              type="button"
              label={isEditMode ? "← Back to Services" : "Cancel"}
              color="whiteDark"
              outline
              onClick={() => navigate("/services")}
              isGrouped
            />
            <Buttons className="!justify-end">
              <Button
                type="submit"
                form="service-form"
                label={isEditMode ? "Update Service" : "Create Service"}
                color="info"
                disabled={isPending}
                isGrouped
              />
            </Buttons>
          </Buttons>
        }
      >
        <h2 className="mb-4 text-lg font-semibold">
          {isEditMode ? "Edit Service" : "Add New Service"}
        </h2>
        <Formik
          initialValues={defaultValues}
          validationSchema={serviceSchema}
          enableReinitialize
          validateOnChange={false}
          onSubmit={(data) => {
            const payload: CreateServiceParams = {
              key: data.key.trim(),
              title: data.title.trim(),
              subtitle: data.subtitle.trim(),
              icon: data.icon.trim(),
              isActive: data.isActive,
            };
            if (isEditMode) {
              updateMutation.mutate({ id: id!, data: payload });
            } else {
              createMutation.mutate(payload);
            }
          }}
        >
          <Form id="service-form">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Key (slug) *" labelFor="key">
                {({ className }) => (
                  <>
                    <Field
                      name="key"
                      id="key"
                      placeholder="e.g. free-shipping"
                      className={className}
                    />
                    <ErrorMessage name="key" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
                  </>
                )}
              </FormField>
              <FormField label="Title *" labelFor="title">
                {({ className }) => (
                  <>
                    <Field
                      name="title"
                      id="title"
                      placeholder="e.g. Free Shipping"
                      className={className}
                    />
                    <ErrorMessage name="title" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
                  </>
                )}
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Subtitle *" labelFor="subtitle">
                {({ className }) => (
                  <>
                    <Field
                      name="subtitle"
                      id="subtitle"
                      placeholder="e.g. On order over $99"
                      className={className}
                    />
                    <ErrorMessage name="subtitle" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
                  </>
                )}
                </FormField>
              </div>
              <FormField label="Icon key *" labelFor="icon">
                {({ className }) => (
                  <>
                    <Field
                      name="icon"
                      id="icon"
                      placeholder="e.g. truck"
                      className={className}
                    />
                    <ErrorMessage name="icon" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
                  </>
                )}
              </FormField>
              <div className="flex items-center">
                <FormCheckRadio type="switch" label="Active">
                  <Field type="checkbox" name="isActive" />
                </FormCheckRadio>
              </div>
            </div>
          </Form>
        </Formik>
      </CardBox>
    </div>
  );
}
