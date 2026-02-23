import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { createOffer, getOfferById, updateOffer } from "../api";
import { offerSchema } from "../validations";
import { ENUM_OFFER_TARGET, ENUM_OFFER_TYPE, Offer } from "../type";
import Select from "../../../components/form/Select";

const offerTypeOption = [
    { value: ENUM_OFFER_TYPE.PERCENTAGE, label: "percentage" },
    { value: ENUM_OFFER_TYPE.FLAT, label: "flat" },
    { value: ENUM_OFFER_TYPE.FREE_SHIPPING, label: "free_shipping" },
    { value: ENUM_OFFER_TYPE.BUY_X_GET_Y, label: "buy_x_get_y" },
];

const offerTargetType = [
    { value: ENUM_OFFER_TARGET.PRODUCT, label : 'product', },
    { value: ENUM_OFFER_TARGET.CATEGORY, label: "category" },
    { value: ENUM_OFFER_TARGET.VARIANT, label: "variant" },
    { value: ENUM_OFFER_TARGET.CART, label: "cart" },
];

type OfferFormValues = {
    name: string;
    type: ENUM_OFFER_TYPE;
    targetType: ENUM_OFFER_TARGET;
};

function OfferForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const { data: offerData, isLoading: isLoadingOffer } = useQuery({
        queryKey: ["offer", id],
        queryFn: () => getOfferById(id!),
        enabled: isEditMode,
        select: (response) => (response.data as { data?: Offer }).data ?? response.data,
    });

    const { isPending: isCreating, mutate: createMutate } = useMutation({
        mutationFn: createOffer,
        onSuccess: () => {
            toast.success("Offer created successfully!");
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            navigate("/offers");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to create offer");
        },
    });

    const { isPending: isUpdating, mutate: updateMutate } = useMutation({
        mutationFn: updateOffer,
        onSuccess: () => {
            toast.success("Offer updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            queryClient.invalidateQueries({ queryKey: ["offer", id] });
            navigate("/offers");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Failed to update offer");
        },
    });

    const formik = useFormik<OfferFormValues>({
        initialValues: {
            name: "",
            type: ENUM_OFFER_TYPE.PERCENTAGE,
            targetType: ENUM_OFFER_TARGET.PRODUCT,
        },
        validationSchema: offerSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: (data) => {
            if (isEditMode) {
                updateMutate({ id: id!, data: { 
                    name: data.name,
                    type: data.type,
                 } });
            } else {
                createMutate({ name: data.name, type: data.type, });
            }
        },
    });

    useEffect(() => {
        if (offerData) {
            const o = offerData as Offer;
            formik.setValues({
                name: (o.name as string) || "",
                type: offerData.type || ENUM_OFFER_TYPE.PERCENTAGE,
                targetType: offerData.targetType || ENUM_OFFER_TARGET.PRODUCT,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offerData]);

    const isPending = isCreating || isUpdating;

    if (isEditMode && isLoadingOffer) {
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
                        {isEditMode ? "Edit Offer" : "Add New Offer"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEditMode
                            ? "Update the offer details below."
                            : "Fill in the details to create a new offer."}
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                        {/* offer name */}
                        <div>
                            <Label>
                                Offer Name <span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="Enter offer name"
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

                        {/* offer type */}
                        <div>
                            <Label htmlFor="offer-type">Type</Label>
                            <Select
                                name="offerType"
                                options={offerTypeOption}
                                placeholder="Select offer type"
                                value={formik.values.type}
                                onChange={(value) => formik.setFieldValue("offerType", value)}
                            />
                            {formik.errors.type && formik.touched.type && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.type}</p>
                            )}
                        </div>

                        {/* offer target */}
                        <div>
                            <Label htmlFor="offer-target">Target</Label>
                            <Select
                                name="offerTarget"
                                options={offerTargetType}
                                placeholder="Select offer target"
                                value={formik.values.targetType}
                                onChange={(value) => formik.setFieldValue("offerTarget", value)}
                            />
                            {formik.errors.targetType && formik.touched.targetType && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.targetType}</p>
                            )}
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/offers")}
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
                                        ? "Update Offer"
                                        : "Create Offer"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default OfferForm;
