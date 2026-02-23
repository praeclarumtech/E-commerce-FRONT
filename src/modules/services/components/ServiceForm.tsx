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
    name: string;
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
        mutationFn: (payload: { id: string; data: { name: string } }) =>
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
            name: "",
        },
        validationSchema: serviceSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: (data) => {
            if (isEditMode) {
                updateMutate({ id: id!, data: { name: data.name } });
            } else {
                createMutate({ name: data.name });
            }
        },
    });

    useEffect(() => {
        if (serviceData) {
            const s = serviceData as Service;
            formik.setValues({
                name: (s.name as string) || "",
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
                                Service Name <span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="Enter service name"
                                type="text"
                                name="name"
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                className="mt-1.5"
                            />
                            {formik.errors.name && formik.touched.name && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.name}</p>
                            )}
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
