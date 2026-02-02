import { useEffect } from "react";

import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import Label from "../../../components/form/Label"
import { CountryFormValu } from "../type";
import { countrySchema } from "../validations";
import Input from "../../../components/form/input/InputField";
import { createCountry, getCountryById, UpdatedCountry } from "../api";

function CountryForm() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    // Fetch role data for edit mode
    const { data: countryData, isLoading: isLoadingCountry } = useQuery({
        queryKey: ['role', id],
        queryFn: () => getCountryById(id!),
        enabled: isEditMode,
        select: (response) => response.data.data,
    });

    const { isPending: isCreating, mutate: createMutate } = useMutation({
        mutationFn: createCountry,
        onSuccess: () => {
            toast.success("Country created successfully!");
            queryClient.invalidateQueries({ queryKey: ['country'] });
            navigate('/country');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to create country");
        }
    });

    const { isPending: isUpdating, mutate: updateMutate } = useMutation({
        mutationFn: UpdatedCountry,
        onSuccess: () => {
            toast.success("Country updated successfully!");
            queryClient.invalidateQueries({ queryKey: ['country'] });
            queryClient.invalidateQueries({ queryKey: ['country', id] });
            navigate('/country');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to update country");
        }
    });

    const formik = useFormik<CountryFormValu>({
        initialValues: {
            countryName: "",
        },
        validationSchema: countrySchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: (data) => {
            if (isEditMode) {
                updateMutate({
                    id,
                    data: {
                        countryName: data.countryName,
                    },
                });
            } else {
                createMutate({
                    countryName: data.countryName,
                });
            }
        },
    });

    // Populate form when role data is loaded
    useEffect(() => {
        if (countryData) {
            formik.setValues({
                countryName: countryData.countryName || "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countryData]);

    const isPending = isCreating || isUpdating;

    if (isEditMode && isLoadingCountry) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <>
            <div className="h-full overflow-y-auto">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {isEditMode ? "Edit Country" : "Add New Country"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEditMode ? "Update the country details below." : "Fill in the details to add country."}
                        </p>
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* Country Name */}
                            <div>
                                <Label>
                                    Country Name<span className="text-error-500">*</span>
                                </Label>
                                <Input
                                    placeholder="Enter country name"
                                    type="text"
                                    name="countryName"
                                    onChange={formik.handleChange}
                                    value={formik.values.countryName}
                                />
                                {formik.errors.countryName && formik.touched.countryName && (
                                    <p className="text-error-500 text-sm mt-1">{formik.errors.countryName}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/country')}
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
                                        : (isEditMode ? "Update Country" : "Add Country")
                                    }
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CountryForm