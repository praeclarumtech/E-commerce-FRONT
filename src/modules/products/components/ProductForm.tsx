import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, FieldArray } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { mdiClose, mdiUpload } from "@mdi/js";

import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import Icon from "../../_components/Icon";
import { toast } from "../../_lib/toast";
import { getImageUrl } from "../../../shared/constant";
import { getCategories } from "../../categories/api";
import type { Category } from "../../categories/interface";
import { getProfile } from "../../users/api";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../api";
import { productSchema } from "../validations";
import {
  ENUM_PRODUCT_STATUS,
  type Product,
  type ProductFormValues,
  type ProductVariant,
} from "../interface";

const statusOptions: { value: ENUM_PRODUCT_STATUS; label: string }[] = [
  { value: ENUM_PRODUCT_STATUS.DRAFT, label: "Draft" },
  { value: ENUM_PRODUCT_STATUS.SAVED, label: "Saved" },
  { value: ENUM_PRODUCT_STATUS.PUBLISH, label: "Publish" },
];

const activeOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const inputClass =
  "px-3 py-2 max-w-full border border-gray-700 rounded-sm w-full dark:placeholder-gray-400 focus:ring-3 focus:ring-blue-600 focus:border-blue-600 focus:outline-hidden h-12 bg-white dark:bg-slate-800 dark:border-slate-600";
const selectClass =
  "px-3 py-2 max-w-full border border-gray-700 rounded-sm w-full focus:ring-3 focus:ring-blue-600 focus:border-blue-600 focus:outline-hidden h-12 bg-white dark:bg-slate-800 dark:border-slate-600";
const textareaClass =
  "px-3 py-2 max-w-full border border-gray-700 rounded-sm w-full dark:placeholder-gray-400 focus:ring-3 focus:ring-blue-600 focus:border-blue-600 focus:outline-hidden h-24 bg-white dark:bg-slate-800 dark:border-slate-600 resize-none";

export default function ProductForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [categoryValueMap, setCategoryValueMap] = useState<
    Record<string, { categoryId: string; subCategoryId: string }>
  >({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImageObjects, setExistingImageObjects] = useState<{ _id: string; imageUrl: string }[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState<string | null>(null);
  const [existingBrandLogo, setExistingBrandLogo] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [existingBanner, setExistingBanner] = useState<string | null>(null);

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !isEditMode,
    select: (res) => (res.data as { data?: { _id?: string } })?.data,
  });
  const userId = profileData?._id;

  const { data: productData, isLoading: isLoadingProduct, isError: isProductError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: isEditMode,
    select: (response) => response.data.data,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories", { limit: 100 }],
    queryFn: () => getCategories({ params: { limit: 100 } }),
    select: (res) => res.data?.data ?? res.data,
  });

  useEffect(() => {
    if (categoriesData?.items) {
      const options: { value: string; label: string }[] = [];
      const valueMap: Record<string, { categoryId: string; subCategoryId: string }> = {};
      (categoriesData.items as Category[]).forEach((cat) => {
        options.push({ value: `c_${cat._id}`, label: cat.name });
        valueMap[`c_${cat._id}`] = { categoryId: cat._id, subCategoryId: "" };
        cat.subCategories?.forEach((sub) => {
          if (sub._id) {
            const val = `s_${cat._id}|${sub._id}`;
            options.push({ value: val, label: `  ↳ ${sub.name}` });
            valueMap[val] = { categoryId: cat._id, subCategoryId: sub._id };
          }
        });
      });
      setCategoryOptions(options);
      setCategoryValueMap(valueMap);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (productData) {
      const p = productData as Product;
      if (p.brandLogo) setExistingBrandLogo(getImageUrl(p.brandLogo as string));
      if (p.bannerImage) setExistingBanner(getImageUrl(p.bannerImage as string));
      if (p.images?.length) {
        const imgs = (p.images as { _id?: string; imageUrl?: string }[]).map((img) => ({
          _id: img._id ?? "",
          imageUrl: img.imageUrl ?? "",
        }));
        setExistingImageObjects(imgs);
      }
    }
  }, [productData]);

  const { isPending: isCreating, mutate: createMutate } = useMutation({
    mutationFn: createProduct,
    onSuccess: (response) => {
      const productId = (response?.data as { data?: { productId?: string } })?.data?.productId;
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (productId) {
        toast.success("Product created. You can add variants in edit mode.");
        navigate(`/products/edit/${productId}`, { replace: true });
      } else {
        toast.success("Product created successfully!");
        navigate("/products");
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to create product");
    },
  });

  const { isPending: isUpdating, mutate: updateMutate } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      navigate("/products");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to update product");
    },
  });

  const handleBrandLogoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBrandLogoFile(file);
      setBrandLogoPreview(URL.createObjectURL(file));
      setExistingBrandLogo(null);
    }
    e.target.value = "";
  }, []);

  const removeBrandLogo = useCallback(() => {
    if (brandLogoPreview) URL.revokeObjectURL(brandLogoPreview);
    setBrandLogoFile(null);
    setBrandLogoPreview(null);
    setExistingBrandLogo(null);
  }, [brandLogoPreview]);

  const handleBannerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
      setExistingBanner(null);
    }
    e.target.value = "";
  }, []);

  const removeBanner = useCallback(() => {
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerFile(null);
    setBannerPreview(null);
    setExistingBanner(null);
  }, [bannerPreview]);

  const handleImagesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) setImageFiles((prev) => [...prev, ...Array.from(files)]);
    e.target.value = "";
  }, []);

  const removeImageFile = useCallback((index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeExistingImage = useCallback((index: number) => {
    const obj = existingImageObjects[index];
    if (obj?._id) setRemovedImageIds((prev) => [...prev, obj._id]);
    setExistingImageObjects((prev) => prev.filter((_, i) => i !== index));
  }, [existingImageObjects]);

  const isPending = isCreating || isUpdating;

  if (isEditMode && isLoadingProduct) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
      </div>
    );
  }

  if (isEditMode && isProductError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-gray-600 dark:text-slate-400">Product not found or you don&apos;t have access.</p>
        <Button type="button" label="← Back to Products" color="whiteDark" outline onClick={() => navigate("/products")} />
      </div>
    );
  }

  const p = productData as Product | undefined;
  const categoryIdValue = typeof p?.categoryId === "object" ? (p?.categoryId as { _id?: string })?._id : p?.categoryId;
  const subCategoryIdValue = typeof p?.subCategoryId === "object" ? (p?.subCategoryId as { _id?: string })?._id : p?.subCategoryId;

  const initialValues: ProductFormValues = {
    categoryId: categoryIdValue ?? "",
    subCategoryId: subCategoryIdValue ?? "",
    name: p?.name ?? "",
    description: p?.description ?? "",
    price: p?.price ?? 0,
    isActive: p?.isActive ?? true,
    status: (p?.status as ENUM_PRODUCT_STATUS) ?? ENUM_PRODUCT_STATUS.DRAFT,
    variants: Array.isArray(p?.variants) ? [...(p.variants as ProductVariant[])] : [],
    brandName: p?.brandName ?? "",
    rating: p?.rating ?? undefined,
    comment: p?.comment ?? "",
  };

  return (
    <div className="h-full overflow-y-auto">
      <CardBox
        footer={
          <Buttons className="!justify-between">
            <Button type="button" label={isEditMode ? "← Back to Products" : "Cancel"} color="whiteDark" outline onClick={() => navigate("/products")} isGrouped />
            <Button type="submit" form="product-form" label={isPending ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Product" : "Create Product"} color="info" disabled={isPending} isGrouped />
          </Buttons>
        }
      >
        <h2 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-slate-100">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-slate-400">
          {isEditMode ? "Update the product details below." : "Fill in the details to create a new product."}
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={productSchema}
          enableReinitialize
          validateOnChange={false}
          onSubmit={(data) => {
            const selVal = data.subCategoryId && data.categoryId ? `s_${data.categoryId}|${data.subCategoryId}` : data.categoryId ? `c_${data.categoryId}` : "";
            const categoryId = categoryValueMap[selVal]?.categoryId ?? data.categoryId;
            const subCategoryId = categoryValueMap[selVal]?.subCategoryId ?? data.subCategoryId;
            if (isEditMode) {
              updateMutate({
                id: id!,
                data: {
                  categoryId,
                  subCategoryId: subCategoryId || undefined,
                  name: data.name,
                  description: data.description,
                  price: data.price,
                  isActive: data.isActive,
                  status: data.status,
                  brandName: data.brandName,
                  rating: data.rating,
                  comment: data.comment,
                  variants: data.variants?.filter((v) => v?.name?.trim() && v?.value?.trim()).length
                    ? data.variants.filter((v) => v?.name?.trim() && v?.value?.trim())
                    : undefined,
                  images: imageFiles.length > 0 ? imageFiles : undefined,
                  removedImages: removedImageIds.length > 0 ? removedImageIds : undefined,
                  bannerImage: bannerFile ?? undefined,
                  brandLogo: brandLogoFile ?? undefined,
                },
              });
            } else {
              if (!userId) {
                toast.error("User not found. Please log in again.");
                return;
              }
              createMutate({
                categoryId,
                subCategoryId: subCategoryId || undefined,
                userId,
                name: data.name,
                description: data.description,
                price: data.price,
                isActive: data.isActive,
                status: data.status,
                brandName: data.brandName,
                rating: data.rating,
                comment: data.comment,
                images: imageFiles.length > 0 ? imageFiles : undefined,
                bannerImage: bannerFile ?? undefined,
                brandLogo: brandLogoFile ?? undefined,
              });
            }
          }}
        >
          {({ setFieldValue, values, errors }) => {
            const selVal = values.subCategoryId && values.categoryId ? `s_${values.categoryId}|${values.subCategoryId}` : "";
            return (
              <Form id="product-form">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField label="Product Name *" labelFor="name">
                    {({ className }) => (
                      <>
                        <Field name="name" id="name" placeholder="Enter product name" maxLength={20} className={className} />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                      </>
                    )}
                  </FormField>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Category *</label>
                    <select
                      className={selectClass}
                      value={selVal || (values.categoryId ? `c_${values.categoryId}` : "")}
                      onChange={(e) => {
                        const mapped = categoryValueMap[e.target.value];
                        if (mapped) {
                          setFieldValue("categoryId", mapped.categoryId);
                          setFieldValue("subCategoryId", mapped.subCategoryId || "");
                        }
                      }}
                    >
                      <option value="">Select category or subcategory</option>
                      {categoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>}
                  </div>
                  <FormField label="Price *" labelFor="price">
                    {({ className }) => (
                      <>
                        <Field name="price" id="price" type="number" min={0} step={0.01} placeholder="0" className={className} />
                        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                      </>
                    )}
                  </FormField>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Status</label>
                    <select className={selectClass} value={values.status} onChange={(e) => setFieldValue("status", e.target.value)}>
                      {statusOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Active</label>
                    <select className={selectClass} value={values.isActive ? "true" : "false"} onChange={(e) => setFieldValue("isActive", e.target.value === "true")}>
                      {activeOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <FormField label="Brand Name" labelFor="brandName">
                    {({ className }) => <Field name="brandName" id="brandName" placeholder="Brand name" className={className} />}
                  </FormField>
                  {isEditMode && (
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Variants (e.g. Size, Color)</label>
                      <p className="mb-2 text-xs text-gray-500 dark:text-slate-400">Add variant name and value after product is created (e.g. Size / M, Color / Red)</p>
                      <FieldArray name="variants">
                        {({ push, remove, form }) => (
                          <div className="space-y-2">
                            {(form.values.variants ?? []).map((_: ProductVariant, index: number) => (
                              <div key={index} className="flex flex-wrap items-center gap-2">
                                <Field name={`variants.${index}.name`} placeholder="Name (e.g. Size)" className="flex-1 min-w-[100px] rounded border border-gray-700 px-3 py-2 h-10 bg-white dark:bg-slate-800 dark:border-slate-600" />
                                <Field name={`variants.${index}.value`} placeholder="Value (e.g. M)" className="flex-1 min-w-[100px] rounded border border-gray-700 px-3 py-2 h-10 bg-white dark:bg-slate-800 dark:border-slate-600" />
                                <Button type="button" label="Remove" color="danger" small outline onClick={() => remove(index)} />
                              </div>
                            ))}
                            <Button type="button" label="+ Add variant" color="info" small outline onClick={() => push({ name: "", value: "" })} />
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  )}
                  <FormField label="Rating (0-5)" labelFor="rating">
                    {({ className }) => <Field name="rating" id="rating" type="number" min={0} max={5} step={0.1} className={className} />}
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField label="Description" labelFor="description" hasTextareaHeight>
                      {({ className }) => (
                        <>
                          <Field as="textarea" name="description" id="description" placeholder="Product description" maxLength={255} rows={3} className={className} />
                          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </>
                      )}
                    </FormField>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Comment</label>
                    <Field as="textarea" name="comment" className={textareaClass} placeholder="Comment" maxLength={500} rows={2} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Product Logo</label>
                    <div className="flex items-center gap-4">
                      {brandLogoPreview || existingBrandLogo ? (
                        <div className="relative">
                          <img src={brandLogoPreview || existingBrandLogo || ""} alt="Logo" className="h-20 w-20 rounded-lg border border-gray-200 object-cover dark:border-slate-600" />
                          <button type="button" onClick={removeBrandLogo} className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600">
                            <Icon path={mdiClose} size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-700 dark:border-slate-600 hover:border-blue-600 dark:hover:border-blue-500">
                          <input type="file" accept="image/*" onChange={handleBrandLogoChange} className="hidden" />
                          <Icon path={mdiUpload} size={24} className="text-gray-500 dark:text-slate-400" />
                        </label>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Banner Image</label>
                    <div className="flex items-center gap-4">
                      {bannerPreview || existingBanner ? (
                        <div className="relative">
                          <img src={bannerPreview || existingBanner || ""} alt="Banner" className="h-20 w-20 rounded-lg border border-gray-200 object-cover dark:border-slate-600" />
                          <button type="button" onClick={removeBanner} className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600">
                            <Icon path={mdiClose} size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-700 dark:border-slate-600 hover:border-blue-600 dark:hover:border-blue-500">
                          <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                          <Icon path={mdiUpload} size={24} className="text-gray-500 dark:text-slate-400" />
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Product Images</label>
                    {isEditMode && existingImageObjects.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {existingImageObjects.map((img, idx) => (
                          <div key={img._id || idx} className="relative">
                            <img src={getImageUrl(img.imageUrl)} alt="" className="h-20 w-20 rounded-lg border border-gray-200 object-cover dark:border-slate-600" />
                            <button type="button" onClick={() => removeExistingImage(idx)} className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600">
                              <Icon path={mdiClose} size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input type="file" accept="image/*" multiple className="hidden" id="product-images" onChange={handleImagesChange} />
                    <Button type="button" label="Add images" icon={mdiUpload} color="info" small onClick={() => document.getElementById("product-images")?.click()} />
                    {imageFiles.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {imageFiles.map((file, idx) => (
                          <div key={`${file.name}-${idx}`} className="relative">
                            <img src={URL.createObjectURL(file)} alt="" className="h-20 w-20 rounded-lg border border-gray-200 object-cover dark:border-slate-600" />
                            <button type="button" onClick={() => removeImageFile(idx)} className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600">
                              <Icon path={mdiClose} size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </CardBox>
    </div>
  );
}
