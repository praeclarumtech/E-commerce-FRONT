import { useEffect } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { createState, getStateById, UpdatedState } from "../api";
import { StateFormValu } from "../type";
import { StateSchema } from "../validation";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { getAllCountry } from "../../country/api";

function StateForm() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    // Fetch country for dropdown
    const { data: countryOptions = [] } = useQuery({
        queryKey: ['country-dropdown'],
        queryFn: getAllCountry,
        select: (response) => {
            const allCountry = response.data.data?.items || [];
            const result = allCountry.reduce((acc: any[], country: any) => {
                if (country.isActive) {
                    acc.push({
                        value: country._id,
                        label: country.countryName
                    });
                }
                return acc;
            }, []);
            return result

        },
    });

    // Fetch state data for edit mode
    const { data: stateData, isLoading: isLoadingState } = useQuery({
        queryKey: ['state', id],
        queryFn: () => getStateById(id!),
        enabled: isEditMode,
        select: (response) => response.data.data,
    });

    const { isPending: isCreating, mutate: createMutate } = useMutation({
        mutationFn: createState,
        onSuccess: () => {
            toast.success("State created successfully!");
            queryClient.invalidateQueries({ queryKey: ['state'] });
            navigate('/state');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to create state");
        }
    });

    const { isPending: isUpdating, mutate: updateMutate } = useMutation({
        mutationFn: UpdatedState,
        onSuccess: () => {
            toast.success("State updated successfully!");
            queryClient.invalidateQueries({ queryKey: ['state'] });
            queryClient.invalidateQueries({ queryKey: ['state', id] });
            navigate('/state');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to update state");
        }
    });

    const formik = useFormik<StateFormValu>({
        initialValues: {
            stateName: "",
            countryId: "",
        },
        validationSchema: StateSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: (data) => {
            if (isEditMode) {
                updateMutate({
                    id,
                    data: {
                        stateName: data.stateName,
                        countryId: data.countryId,
                    },
                });
            } else {
                createMutate({
                    stateName: data.stateName,
                    countryId: data.countryId,
                });
            }
        },
    });

    // Populate form when state data is loaded
    useEffect(() => {
        if (stateData) {
            formik.setValues({
                stateName: stateData.stateName || "",
                countryId: stateData.countryId || "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateData]);

    const isPending = isCreating || isUpdating;

    if (isEditMode && isLoadingState) {
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
                        {isEditMode ? "Edit State" : "Add New State"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEditMode ? "Update the state details below." : "Fill in the details to add state."}
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* State Name */}
                        <div>
                            <Label>
                                State Name<span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="Enter state name"
                                type="text"
                                name="stateName"
                                onChange={formik.handleChange}
                                value={formik.values.stateName}
                            />
                            {formik.errors.stateName && formik.touched.stateName && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.stateName}</p>
                            )}
                        </div>

                        <div>
                            <Label>
                                Country<span className="text-error-500">*</span>
                            </Label>
                            <Select
                                name="countryId"
                                options={countryOptions}
                                placeholder="Select country"
                                value={formik.values.countryId}
                                onChange={(value) => formik.setFieldValue("countryId", value)}
                            />
                            {formik.errors.countryId && formik.touched.countryId && (
                                <p className="text-error-500 text-sm mt-1">
                                    {formik.errors.countryId}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/state')}
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
                                    ? (isEditMode ? "Updating..." : "Adding...")
                                    : (isEditMode ? "Update State" : "Add State")
                                }
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default StateForm