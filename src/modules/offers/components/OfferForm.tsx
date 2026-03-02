import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import MultiSelect from "../../../components/form/MultiSelect";
import { createOffer, getOfferById, updateOffer } from "../api";
import { getProducts } from "../../products/api";
import { getCategories } from "../../categories/api";
import { getVariants } from "../../variants/api";
import { offerSchema } from "../validations";
import { CreateOfferParams, Offer, UpdateOfferParams } from "../type";
import {
    OFFER_TYPE_OPTIONS,
    OFFER_TARGET_OPTIONS,
    ENUM_OFFER_TARGET,
} from "../constants";
import type { Product } from "../../products/type";
import type { Category } from "../../categories/type";
import type { Variant } from "../../products/type";

type OfferFormValues = {
    name: string;
    code: string;
    description: string;
    type: string;
    value: string;
    minOrderValue: string;
    startDate: string;
    endDate: string;
    targetType: string;
    targetIds: string[];
    isStackable: boolean;
    usageLimit: string;
    usageLimitPerUser: string;
    isActive: boolean;
};

const initialValues: OfferFormValues = {
    name: "",
    code: "",
    description: "",
    type: "",
    value: "",
    minOrderValue: "",
    startDate: "",
    endDate: "",
    targetType: "",
    targetIds: [],
    isStackable: false,
    usageLimit: "",
    usageLimitPerUser: "",
    isActive: true,
};

function normalizeListResponse<T>(body: unknown): T[] {
    if (!body) return [];
    if (Array.isArray(body)) return body as T[];
    const d = body as { items?: T[]; data?: T[] | { items?: T[] } };
    if (Array.isArray(d.items)) return d.items;
    if (Array.isArray(d.data)) return d.data;
    const inner = d.data as { items?: T[] } | undefined;
    return (inner?.items ?? []) as T[];
}

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
        initialValues,
        validationSchema: offerSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: (data) => {
            const needsIds =
                data.targetType === ENUM_OFFER_TARGET.PRODUCT ||
                data.targetType === ENUM_OFFER_TARGET.CATEGORY ||
                data.targetType === ENUM_OFFER_TARGET.VARIANT;
            const payload = {
                name: data.name.trim(),
                code: data.code?.trim() || undefined,
                description: data.description?.trim() || undefined,
                type: data.type,
                value: Number(data.value),
                minOrderValue: data.minOrderValue ? Number(data.minOrderValue) : undefined,
                startDate: data.startDate || undefined,
                endDate: data.endDate || undefined,
                targetType: data.targetType,
                targetIds: needsIds && data.targetIds?.length ? data.targetIds : undefined,
                isStackable: data.isStackable,
                usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
                usageLimitPerUser: data.usageLimitPerUser ? Number(data.usageLimitPerUser) : undefined,
                isActive: data.isActive,
            };

            if (isEditMode) {
                updateMutate({ id: id!, data: payload as UpdateOfferParams });
            } else {
                createMutate(payload as CreateOfferParams);
            }
        },
    });

    const targetType = formik.values.targetType;
    const { data: productsData } = useQuery({
        queryKey: ["products", "offer-form", { limit: 500 }],
        queryFn: () => getProducts({ params: { limit: 500 } }),
        enabled: targetType === ENUM_OFFER_TARGET.PRODUCT,
        select: (response: { data?: unknown }) => normalizeListResponse<Product>(response.data as { items?: Product[]; data?: Product[] }),
    });
    const { data: categoriesData } = useQuery({
        queryKey: ["categories", "offer-form", { limit: 500 }],
        queryFn: () => getCategories({ params: { limit: 500 } }),
        enabled: targetType === ENUM_OFFER_TARGET.CATEGORY,
        select: (response: { data?: unknown }) => normalizeListResponse<Category>(response.data as { items?: Category[]; data?: Category[] }),
    });
    const { data: variantsData } = useQuery({
        queryKey: ["variants", "offer-form", { limit: 500 }],
        queryFn: () => getVariants({ params: { limit: 500 } }),
        enabled: targetType === ENUM_OFFER_TARGET.VARIANT,
        select: (response: { data?: unknown }) => normalizeListResponse<Variant>(response.data as { items?: Variant[]; data?: Variant[] }),
    });

    const productOptions = useMemo(
        () => (productsData ?? []).map((p) => ({ value: p._id, text: p.name || p._id })),
        [productsData]
    );
    const categoryOptions = useMemo(
        () => (categoriesData ?? []).map((c) => ({ value: c._id, text: c.name || c._id })),
        [categoriesData]
    );
    const variantOptions = useMemo(
        () =>
            (variantsData ?? []).map((v) => ({
                value: v._id,
                text:
                    Object.entries(v.attributes || {})
                        .map(([k, val]) => `${k}: ${val}`)
                        .join(", ") || v._id,
            })),
        [variantsData]
    );

    useEffect(() => {
        if (offerData) {
            const o = offerData as Offer;
            const targetIds = (o.targetIds as string[] | undefined) ?? [];
            formik.setValues({
                name: (o.name as string) || "",
                code: (o.code as string) || "",
                description: (o.description as string) || "",
                type: (o.type as string) || "",
                value: o.value != null ? String(o.value) : "",
                minOrderValue: o.minOrderValue != null ? String(o.minOrderValue) : "",
                startDate: (o.startDate as string) || "",
                endDate: (o.endDate as string) || "",
                targetType: (o.targetType as string) || "",
                targetIds,
                isStackable: !!o.isStackable,
                usageLimit: o.usageLimit != null ? String(o.usageLimit) : "",
                usageLimitPerUser: o.usageLimitPerUser != null ? String(o.usageLimitPerUser) : "",
                isActive: o.isActive !== false,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offerData]);

    const needsTargetIds =
        formik.values.targetType &&
        formik.values.targetType !== ENUM_OFFER_TARGET.CART;

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
                        <div className="sm:col-span-2">
                            <Label>Offer name <span className="text-error-500">*</span></Label>
                            <Input
                                placeholder="e.g. 10% off"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                className="mt-1.5"
                            />
                            {formik.errors.name && formik.touched.name && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <Label>Code (optional)</Label>
                            <Input
                                placeholder="e.g. 10%off"
                                name="code"
                                value={formik.values.code}
                                onChange={formik.handleChange}
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                            <Label>Offer type <span className="text-error-500">*</span></Label>
                            <div className="mt-1.5">
                                <Select
                                    placeholder="Select type"
                                    options={OFFER_TYPE_OPTIONS}
                                    value={formik.values.type}
                                    onChange={(v) => formik.setFieldValue("type", v)}
                                />
                            </div>
                            {formik.errors.type && formik.touched.type && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.type}</p>
                            )}
                        </div>

                        <div>
                            <Label>Value <span className="text-error-500">*</span></Label>
                            <Input
                                type="number"
                                min={0}
                                step={1}
                                placeholder="e.g. 10"
                                name="value"
                                value={formik.values.value}
                                onChange={formik.handleChange}
                                className="mt-1.5"
                            />
                            {formik.errors.value && formik.touched.value && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.value}</p>
                            )}
                        </div>

                        <div>
                            <Label>Min order value (optional)</Label>
                            <Input
                                type="number"
                                min={0}
                                step={1}
                                placeholder="e.g. 100"
                                name="minOrderValue"
                                value={formik.values.minOrderValue}
                                onChange={formik.handleChange}
                                className="mt-1.5"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <Label>Description (optional)</Label>
                            <textarea
                                name="description"
                                placeholder="e.g. 10% off on all products"
                                rows={2}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                            />
                        </div>

                        <div>
                            <Label>Start date (optional)</Label>
                            <Input
                                type="datetime-local"
                                name="startDate"
                                value={formik.values.startDate}
                                onChange={formik.handleChange}
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                            <Label>End date (optional)</Label>
                            <Input
                                type="datetime-local"
                                name="endDate"
                                value={formik.values.endDate}
                                onChange={formik.handleChange}
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                            <Label>Target type <span className="text-error-500">*</span></Label>
                            <div className="mt-1.5">
                                <Select
                                    placeholder="Select target"
                                    options={OFFER_TARGET_OPTIONS}
                                    value={formik.values.targetType}
                                    onChange={(v) => {
                                        formik.setFieldValue("targetType", v);
                                        formik.setFieldValue("targetIds", []);
                                    }}
                                />
                            </div>
                            {formik.errors.targetType && formik.touched.targetType && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.targetType}</p>
                            )}
                        </div>

                        {formik.values.targetType === ENUM_OFFER_TARGET.PRODUCT && (
                            <div className="sm:col-span-2">
                                <MultiSelect
                                    label="Products"
                                    placeholder="Select products"
                                    options={productOptions}
                                    value={formik.values.targetIds}
                                    onChange={(selected) => formik.setFieldValue("targetIds", selected)}
                                />
                                {(formik.errors.targetIds && (formik.touched.targetIds || formik.submitCount > 0)) && (
                                    <p className="text-error-500 text-sm mt-1">{formik.errors.targetIds as string}</p>
                                )}
                            </div>
                        )}
                        {formik.values.targetType === ENUM_OFFER_TARGET.CATEGORY && (
                            <div className="sm:col-span-2">
                                <MultiSelect
                                    label="Categories"
                                    placeholder="Select categories"
                                    options={categoryOptions}
                                    value={formik.values.targetIds}
                                    onChange={(selected) => formik.setFieldValue("targetIds", selected)}
                                />
                                {(formik.errors.targetIds && (formik.touched.targetIds || formik.submitCount > 0)) && (
                                    <p className="text-error-500 text-sm mt-1">{formik.errors.targetIds as string}</p>
                                )}
                            </div>
                        )}
                        {formik.values.targetType === ENUM_OFFER_TARGET.VARIANT && (
                            <div className="sm:col-span-2">
                                <MultiSelect
                                    label="Variants"
                                    placeholder="Select variants"
                                    options={variantOptions}
                                    value={formik.values.targetIds}
                                    onChange={(selected) => formik.setFieldValue("targetIds", selected)}
                                />
                                {(formik.errors.targetIds && (formik.touched.targetIds || formik.submitCount > 0)) && (
                                    <p className="text-error-500 text-sm mt-1">{formik.errors.targetIds as string}</p>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isStackable"
                                checked={formik.values.isStackable}
                                onChange={(e) => formik.setFieldValue("isStackable", e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="isStackable">Stackable</Label>
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

                        <div>
                            <Label>Usage limit (optional)</Label>
                            <Input
                                type="number"
                                min={1}
                                placeholder="e.g. 100"
                                name="usageLimit"
                                value={formik.values.usageLimit}
                                onChange={formik.handleChange}
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                            <Label>Usage limit per user (optional)</Label>
                            <Input
                                type="number"
                                min={1}
                                placeholder="e.g. 1"
                                name="usageLimitPerUser"
                                value={formik.values.usageLimitPerUser}
                                onChange={formik.handleChange}
                                className="mt-1.5"
                            />
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
