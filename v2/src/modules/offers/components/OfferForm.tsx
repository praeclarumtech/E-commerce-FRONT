import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import FormCheckRadio from "../../_components/FormField/CheckRadio";
import { createOffer, getOfferById, updateOffer } from "../api";
import { getProducts } from "../../products/api";
import { getCategories } from "../../categories/api";
import { getVariants } from "../../variants/api";
import { offerSchema } from "../validations";
import {
  OFFER_TYPE_OPTIONS,
  OFFER_TARGET_OPTIONS,
  ENUM_OFFER_TARGET,
} from "../constants";
import type { Offer, CreateOfferParams, UpdateOfferParams } from "../interface";
import type { Product } from "../../products/interface";
import type { Category } from "../../categories/interface";
import { toast } from "../../_lib/toast";

function normalizeListResponse<T>(body: unknown): T[] {
  if (!body) return [];
  if (Array.isArray(body)) return body as T[];
  const d = body as { items?: T[]; data?: T[] | { items?: T[] } };
  if (Array.isArray(d.items)) return d.items;
  if (Array.isArray(d.data)) return d.data;
  const inner = d.data as { items?: T[] } | undefined;
  return (inner?.items ?? []) as T[];
}

type FormValues = {
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

const initialValues: FormValues = {
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

export default function OfferForm() {
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

  const createMutation = useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      toast.success("Offer created successfully!");
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      navigate("/offers");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to create offer");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id: offerId, data: payload }: { id: string; data: UpdateOfferParams }) =>
      updateOffer({ id: offerId, data: payload }),
    onSuccess: () => {
      toast.success("Offer updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offer", id] });
      navigate("/offers");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update offer");
    },
  });

  const { data: productsRes } = useQuery({
    queryKey: ["products", "offer-form", 500],
    queryFn: () => getProducts({ params: { limit: 500 } }),
    select: (res) => {
      const raw = res.data?.data ?? res.data;
      return normalizeListResponse<Product>(raw as { items?: Product[] });
    },
  });
  const { data: categoriesRes } = useQuery({
    queryKey: ["categories", "offer-form", 500],
    queryFn: () => getCategories({ params: { limit: 500 } }),
    select: (res) => {
      const raw = res.data?.data ?? res.data;
      return normalizeListResponse<Category>(raw as { items?: Category[] });
    },
  });
  const { data: variantsRes } = useQuery({
    queryKey: ["variants", "offer-form", 500],
    queryFn: () => getVariants({ params: { limit: 500 } }),
    select: (res) => {
      const raw = res.data?.data ?? res.data;
      return normalizeListResponse<{ _id: string; attributes?: Record<string, unknown> }>(raw as { items?: { _id: string; attributes?: Record<string, unknown> }[] });
    },
  });

  const productOptions = useMemo(
    () => (productsRes ?? []).map((p) => ({ value: p._id, label: (p.name as string) || p._id })),
    [productsRes]
  );
  const categoryOptions = useMemo(
    () => (categoriesRes ?? []).map((c) => ({ value: c._id, label: (c.name as string) || c._id })),
    [categoriesRes]
  );
  const variantOptions = useMemo(
    () =>
      (variantsRes ?? []).map((v) => ({
        value: v._id,
        label:
          (v.attributes && Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(", ")) || v._id,
      })),
    [variantsRes]
  );

  if (isEditMode && isLoadingOffer) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
      </div>
    );
  }

  const defaultValues: FormValues = offerData
    ? {
        name: (offerData.name as string) ?? "",
        code: (offerData.code as string) ?? "",
        description: (offerData.description as string) ?? "",
        type: (offerData.type as string) ?? "",
        value: offerData.value != null ? String(offerData.value) : "",
        minOrderValue: offerData.minOrderValue != null ? String(offerData.minOrderValue) : "",
        startDate: (offerData.startDate as string) ?? "",
        endDate: (offerData.endDate as string) ?? "",
        targetType: (offerData.targetType as string) ?? "",
        targetIds: (offerData.targetIds as string[]) ?? [],
        isStackable: !!offerData.isStackable,
        usageLimit: offerData.usageLimit != null ? String(offerData.usageLimit) : "",
        usageLimitPerUser: offerData.usageLimitPerUser != null ? String(offerData.usageLimitPerUser) : "",
        isActive: offerData.isActive !== false,
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
              label={isEditMode ? "← Back to Offers" : "Cancel"}
              color="whiteDark"
              outline
              onClick={() => navigate("/offers")}
              isGrouped
            />
            <Buttons className="!justify-end">
              <Button
                type="submit"
                form="offer-form"
                label={isEditMode ? "Update Offer" : "Create Offer"}
                color="info"
                disabled={isPending}
                isGrouped
              />
            </Buttons>
          </Buttons>
        }
      >
        <h2 className="mb-4 text-lg font-semibold">
          {isEditMode ? "Edit Offer" : "Add New Offer"}
        </h2>
        <Formik
          initialValues={defaultValues}
          validationSchema={offerSchema}
          enableReinitialize
          validateOnChange={false}
          onSubmit={(data) => {
            const needsIds =
              data.targetType === ENUM_OFFER_TARGET.PRODUCT ||
              data.targetType === ENUM_OFFER_TARGET.CATEGORY ||
              data.targetType === ENUM_OFFER_TARGET.VARIANT;
            const payload: CreateOfferParams = {
              name: data.name.trim(),
              code: data.code?.trim() || undefined,
              description: data.description?.trim() || undefined,
              type: data.type as CreateOfferParams["type"],
              value: Number(data.value),
              minOrderValue: data.minOrderValue ? Number(data.minOrderValue) : undefined,
              startDate: data.startDate || undefined,
              endDate: data.endDate || undefined,
              targetType: data.targetType as CreateOfferParams["targetType"],
              targetIds: needsIds && data.targetIds?.length ? data.targetIds : undefined,
              isStackable: data.isStackable,
              usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
              usageLimitPerUser: data.usageLimitPerUser ? Number(data.usageLimitPerUser) : undefined,
              isActive: data.isActive,
            };
            if (isEditMode) {
              updateMutation.mutate({ id: id!, data: payload });
            } else {
              createMutation.mutate(payload);
            }
          }}
        >
          {({ values, setFieldValue, errors, touched, setFieldTouched }) => {
            // Enable target options queries based on current form value
            const currentTarget = values.targetType;
            const showProducts = currentTarget === ENUM_OFFER_TARGET.PRODUCT;
            const showCategories = currentTarget === ENUM_OFFER_TARGET.CATEGORY;
            const showVariants = currentTarget === ENUM_OFFER_TARGET.VARIANT;
            const targetOptions = showProducts
              ? productOptions
              : showCategories
                ? categoryOptions
                : showVariants
                  ? variantOptions
                  : [];

            return (
              <Form id="offer-form">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Offer name *" labelFor="name">
                    {({ className }) => (
                      <>
                        <Field
                          name="name"
                          id="name"
                          placeholder="e.g. 10% off"
                          className={className}
                        />
                        <ErrorMessage name="name" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
                      </>
                    )}
                  </FormField>
                  <FormField label="Code (optional)" labelFor="code">
                    {({ className }) => (
                      <Field name="code" id="code" placeholder="e.g. SAVE10" className={className} />
                    )}
                  </FormField>
                  <FormField label="Offer type *" labelFor="type">
                    {({ className }) => (
                      <>
                        <Field as="select" name="type" id="type" className={className}>
                          <option value="">Select type</option>
                          {OFFER_TYPE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="type" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
                      </>
                    )}
                  </FormField>
                  <FormField label="Value *" labelFor="value">
                    {({ className }) => (
                      <>
                        <Field
                          name="value"
                          id="value"
                          type="number"
                          min={0}
                          placeholder="e.g. 10"
                          className={className}
                        />
                        <ErrorMessage name="value" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
                      </>
                    )}
                  </FormField>
                  <FormField label="Min order value (optional)" labelFor="minOrderValue">
                    {({ className }) => (
                      <Field
                        name="minOrderValue"
                        id="minOrderValue"
                        type="number"
                        min={0}
                        placeholder="e.g. 100"
                        className={className}
                      />
                    )}
                  </FormField>
                  <FormField label="Target type *" labelFor="targetType">
                    {({ className }) => (
                      <>
                        <Field
                          as="select"
                          name="targetType"
                          id="targetType"
                          className={className}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setFieldValue("targetType", e.target.value);
                            setFieldValue("targetIds", []);
                          }}
                        >
                          <option value="">Select target</option>
                          {OFFER_TARGET_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="targetType" className="mt-1 text-sm text-red-600 dark:text-red-400" component="p" />
                      </>
                    )}
                  </FormField>
                  {(showProducts || showCategories || showVariants) && (
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium">
                        {showProducts ? "Products" : showCategories ? "Categories" : "Variants"} *
                      </label>
                      <Field
                        as="select"
                        name="targetIds"
                        multiple
                        className="mb-2 max-w-full border border-gray-700 rounded-sm bg-white px-3 py-2 dark:bg-slate-800 dark:placeholder-gray-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-600 focus:outline-hidden h-24"
                        value={values.targetIds}
                        onBlur={() => setFieldTouched("targetIds")}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const selected = Array.from(e.target.selectedOptions, (o) => o.value);
                          setFieldValue("targetIds", selected);
                        }}
                      >
                        {targetOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </Field>
                      {errors.targetIds && (touched.targetIds || values.targetIds?.length === 0) && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {errors.targetIds as string}
                        </p>
                      )}
                    </div>
                  )}
                  <FormField label="Description (optional)" labelFor="description" hasTextareaHeight>
                    {({ className }) => (
                      <Field
                        as="textarea"
                        name="description"
                        id="description"
                        placeholder="e.g. 10% off on all products"
                        rows={2}
                        className={className}
                      />
                    )}
                  </FormField>
                  <FormField label="Start date (optional)" labelFor="startDate">
                    {({ className }) => (
                      <Field
                        name="startDate"
                        id="startDate"
                        type="datetime-local"
                        className={className}
                      />
                    )}
                  </FormField>
                  <FormField label="End date (optional)" labelFor="endDate">
                    {({ className }) => (
                      <Field
                        name="endDate"
                        id="endDate"
                        type="datetime-local"
                        className={className}
                      />
                    )}
                  </FormField>
                  <FormField label="Usage limit (optional)" labelFor="usageLimit">
                    {({ className }) => (
                      <Field
                        name="usageLimit"
                        id="usageLimit"
                        type="number"
                        min={1}
                        placeholder="e.g. 100"
                        className={className}
                      />
                    )}
                  </FormField>
                  <FormField label="Usage limit per user (optional)" labelFor="usageLimitPerUser">
                    {({ className }) => (
                      <Field
                        name="usageLimitPerUser"
                        id="usageLimitPerUser"
                        type="number"
                        min={1}
                        placeholder="e.g. 1"
                        className={className}
                      />
                    )}
                  </FormField>
                </div>
                <div className="mt-4 flex flex-wrap gap-6">
                  <FormCheckRadio type="checkbox" label="Stackable">
                    <Field type="checkbox" name="isStackable" />
                  </FormCheckRadio>
                  <FormCheckRadio type="switch" label="Active">
                    <Field type="checkbox" name="isActive" />
                  </FormCheckRadio>
                </div>
              </Form>
            );
          }}
        </Formik>
      </CardBox>
    </div>
  );
}
