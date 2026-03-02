import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { createRole, getRoleById, updateRole } from "../api";
import { roleSchema } from "../validations";
import { RoleFormValues } from "../type";

const activeOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
];

function RoleForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    // Fetch role data for edit mode
    const { data: roleData, isLoading: isLoadingRole } = useQuery({
        queryKey: ['role', id],
        queryFn: () => getRoleById(id!),
        enabled: isEditMode,
        select: (response) => response.data.data,
    });

    const { isPending: isCreating, mutate: createMutate } = useMutation({
        mutationFn: createRole,
        onSuccess: () => {
            toast.success("Role created successfully!");
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            navigate('/roles');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to create role");
        }
    });

    const { isPending: isUpdating, mutate: updateMutate } = useMutation({
        mutationFn: updateRole,
        onSuccess: () => {
            toast.success("Role updated successfully!");
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            queryClient.invalidateQueries({ queryKey: ['role', id] });
            navigate('/roles');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to update role");
        }
    });

    const formik = useFormik<RoleFormValues>({
        initialValues: {
            name: "",
            isActive: true,
        },
        validationSchema: roleSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: (data) => {
            if (isEditMode) {
                updateMutate({
                    id,
                    data: {
                        name: data.name,
                        isActive: data.isActive,
                    },
                });
            } else {
                createMutate({
                    name: data.name,
                    isActive: data.isActive,
                });
            }
        },
    });

    // Populate form when role data is loaded
    useEffect(() => {
        if (roleData) {
            formik.setValues({
                name: roleData.name || "",
                isActive: roleData.isActive ?? true,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleData]);

    const isPending = isCreating || isUpdating;

    if (isEditMode && isLoadingRole) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {isEditMode ? "Edit Role" : "Add New Role"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEditMode ? "Update the role details below." : "Fill in the details to create a new role."}
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* Role Name */}
                        <div>
                            <Label>
                                Role Name<span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="Enter role name"
                                type="text"
                                name="name"
                                onChange={(e) =>
                                    formik.setFieldValue("name", e.target.value.replace(/\d/g, ""))
                                }
                                value={formik.values.name}
                            />
                            {formik.errors.name && formik.touched.name && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.name}</p>
                            )}
                        </div>

                        {/* Active Status */}
                        <div>
                            <Label>Status</Label>
                            <Select
                                name="isActive"
                                options={activeOptions}
                                placeholder="Select status"
                                value={formik.values.isActive ? "true" : "false"}
                                onChange={(value) => formik.setFieldValue("isActive", value === "true")}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/roles')}
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
                                    ? (isEditMode ? "Updating..." : "Creating...") 
                                    : (isEditMode ? "Update Role" : "Create Role")
                                }
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RoleForm;
