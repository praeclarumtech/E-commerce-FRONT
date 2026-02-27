import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { createService, getServiceById, updateService } from "../api";
import { serviceSchema } from "../validations";
import { Service } from "../type";

type ServiceFormValues = {
    key: string;
    title: string;
    subtitle: string;
    icon: string;
    isActive: boolean;
};

function ServiceForm() {
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

    const { isPending: isCreating, mutate: createMutate } = useMutation({
        mutationFn: createService,
        onSuccess: () => {
            toast.success("Service created successfully!");
            queryClient.invalidateQueries({ queryKey: ["services"] });
            navigate("/services");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to create service");
        },
    });

    const { isPending: isUpdating, mutate: updateMutate } = useMutation({
        mutationFn: (payload: { id: string; data: { key?: string; title?: string; subtitle?: string; icon?: string; isActive?: boolean } }) =>
            updateService(payload.id, payload.data),
        onSuccess: () => {
            toast.success("Service updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["services"] });
            queryClient.invalidateQueries({ queryKey: ["service", id] });
            navigate("/services");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to update service");
        },
    });

    const formik = useFormik<ServiceFormValues>({
        initialValues: {
            key: "",
            title: "",
            subtitle: "",
            icon: "",
            isActive: true,
        },
        validationSchema: serviceSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: (data) => {
            const payload = {
                key: data.key.trim(),
                title: data.title.trim(),
                subtitle: data.subtitle.trim(),
                icon: data.icon.trim(),
                isActive: data.isActive,
            };
            if (isEditMode) {
                updateMutate({ id: id!, data: payload });
            } else {
                createMutate(payload);
            }
        },
    });

    useEffect(() => {
        if (serviceData) {
            const s = serviceData as Service;
            formik.setValues({
                key: (s.key as string) || "",
                title: (s.title as string) || "",
                subtitle: (s.subtitle as string) || "",
                icon: (s.icon as string) || "",
                isActive: s.isActive !== false,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceData]);

    const isPending = isCreating || isUpdating;

    if (isEditMode && isLoadingService) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {isEditMode ? "Edit Service" : "Add New Service"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEditMode
                            ? "Update the service details below."
                            : "Fill in the details to create a new service."}
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <Label>
                                Key (slug) <span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="e.g. free-shipping"
                                type="text"
                                name="key"
                                onChange={formik.handleChange}
                                value={formik.values.key}
                                className="mt-1.5"
                            />
                            {formik.errors.key && formik.touched.key && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.key}</p>
                            )}
                        </div>

                        <div>
                            <Label>
                                Title <span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="e.g. Free Shipping"
                                type="text"
                                name="title"
                                onChange={formik.handleChange}
                                value={formik.values.title}
                                className="mt-1.5"
                            />
                            {formik.errors.title && formik.touched.title && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.title}</p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <Label>
                                Subtitle <span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="e.g. On order over $99"
                                type="text"
                                name="subtitle"
                                onChange={formik.handleChange}
                                value={formik.values.subtitle}
                                className="mt-1.5"
                            />
                            {formik.errors.subtitle && formik.touched.subtitle && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.subtitle}</p>
                            )}
                        </div>

                        <div>
                            <Label>
                                Icon key <span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="e.g. truck"
                                type="text"
                                name="icon"
                                onChange={formik.handleChange}
                                value={formik.values.icon}
                                className="mt-1.5"
                            />
                            {formik.errors.icon && formik.touched.icon && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.icon}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formik.values.isActive}
                                onChange={(e) => formik.setFieldValue("isActive", e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="isActive">Active</Label>
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/services")}
                                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 transition rounded-lg border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending
                                    ? isEditMode
                                        ? "Updating..."
                                        : "Creating..."
                                    : isEditMode
                                      ? "Update Service"
                                      : "Create Service"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ServiceForm;
