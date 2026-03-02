import { useEffect } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useFormik } from "formik";

import { createCiyt, getCityById, UpdatedCity } from "../api";
import { getAllCountry } from "../../country/api";
import { CityFormValu } from "../type";
import { CitySchema } from "../validation";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { getAllState } from "../../state/api";

function CityForm() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const formik = useFormik<CityFormValu>({
        initialValues: {
            countryId: "",
            stateId: "",
            cityName: "",
        },
        validationSchema: CitySchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: (data) => {
            if (isEditMode) {
                updateMutate({
                    id,
                    data: {
                        stateId: data.stateId,
                        countryId: data.countryId,
                        cityName: data.cityName,
                    },
                });
            } else {
                createMutate({
                    stateId: data.stateId,
                    countryId: data.countryId,
                    cityName: data.cityName,
                });
            }
        },
    });

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

    // Fetch country for dropdown
    const { data: stateOptions = [] } = useQuery({
        queryKey: ['state-dropdown'],
        queryFn: getAllState,
        select: (response) => {
            const allCountry = response.data.data?.items || [];
            const result = allCountry.reduce((acc: any[], state: any) => {
                if (state.isActive) {
                    acc.push({
                        value: state._id,
                        label: state.stateName
                    });
                }
                return acc;
            }, []);
            return result

        },
    });

    // // Fetch state for dropdown
    // const { data, isPending: isStateFetching, mutate: fetchStateFn } = useMutation({
    //     mutationFn: () => getState({ params: { countryId: formik.values.countryId } }),
    // });

    // console.log(data)

    // Fetch city data for edit mode
    const { data: cityData, isLoading: isLoadingState } = useQuery({
        queryKey: ['city', id],
        queryFn: () => getCityById(id!),
        enabled: isEditMode,
        select: (response) => response.data.data,
    });

    const { isPending: isCreating, mutate: createMutate } = useMutation({
        mutationFn: createCiyt,
        onSuccess: () => {
            toast.success("City created successfully!");
            queryClient.invalidateQueries({ queryKey: ['city'] });
            navigate('/city');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to create city");
        }
    });

    const { isPending: isUpdating, mutate: updateMutate } = useMutation({
        mutationFn: UpdatedCity,
        onSuccess: () => {
            toast.success("City updated successfully!");
            queryClient.invalidateQueries({ queryKey: ['city'] });
            queryClient.invalidateQueries({ queryKey: ['city', id] });
            navigate('/city');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to update city");
        }
    });



    // Populate form when state data is loaded
    useEffect(() => {
        if (cityData) {
            formik.setValues({
                stateId: cityData.stateId || "",
                countryId: cityData.countryId || "",
                cityName: cityData.cityName || "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cityData]);

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
                        {isEditMode ? "Edit City" : "Add New City"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEditMode ? "Update the city details below." : "Fill in the details to add city."}
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                        <div>
                            <Label>
                                Country<span className="text-error-500">*</span>
                            </Label>
                            <Select
                                name="countryId"
                                options={countryOptions}
                                placeholder="Select country"
                                value={formik.values.countryId}
                                onChange={(value) => {
                                    formik.setFieldValue("countryId", value)
                                }}
                            />
                            {formik.errors.countryId && formik.touched.countryId && (
                                <p className="text-error-500 text-sm mt-1">
                                    {formik.errors.countryId}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>
                                State<span className="text-error-500">*</span>
                            </Label>
                            <Select
                                name="stateId"
                                options={stateOptions}
                                placeholder="Select state"
                                value={formik.values.stateId}
                                onChange={(value) => formik.setFieldValue("stateId", value)}
                            />
                            {formik.errors.stateId && formik.touched.stateId && (
                                <p className="text-error-500 text-sm mt-1">
                                    {formik.errors.stateId}
                                </p>
                            )}
                        </div>

                        {/* City Name */}
                        <div>
                            <Label>
                                City Name<span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="Enter city name"
                                type="text"
                                name="cityName"
                                onChange={formik.handleChange}
                                value={formik.values.cityName}
                            />
                            {formik.errors.cityName && formik.touched.cityName && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.cityName}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/city')}
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
                                    : (isEditMode ? "Update City" : "Add City")
                                }
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CityForm