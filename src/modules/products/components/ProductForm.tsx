import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
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
import { getBrands } from "../../brands/api";
import type { Brand, BrandImage } from "../../brands/interface";
import { getProfile } from "../../users/api";
import {
  createProduct,
  getProductById,
  updateProduct,
  getVariantsByProductId,
  createVariant,
  deleteVariant,
  type VariantResponse,
} from "../api";
import { productSchema } from "../validations";
import {
  ENUM_PRODUCT_STATUS,
  type Product,
  type ProductFormValues,
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
  const productImagesInputRef = useRef<HTMLInputElement>(null);
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState<string | null>(null);
  const [existingBrandLogo, setExistingBrandLogo] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [existingBanner, setExistingBanner] = useState<string | null>(null);

  const [newVariantPrice, setNewVariantPrice] = useState<string>("");
  const [newVariantStock, setNewVariantStock] = useState<string>("");
  const [newVariantSku, setNewVariantSku] = useState<string>("");
  const [newVariantAttrs, setNewVariantAttrs] = useState<{ name: string; value: string }[]>([{ name: "", value: "" }]);
  const [newVariantImages, setNewVariantImages] = useState<File[]>([]);

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

  const { data: variantsData, refetch: refetchVariants } = useQuery({
    queryKey: ["variants", id],
    queryFn: () => getVariantsByProductId(id!),
    enabled: isEditMode && !!id,
    select: (res) => (res.data?.data ?? res.data ?? []) as VariantResponse[],
  });

  const createVariantMutation = useMutation({
    mutationFn: createVariant,
    onSuccess: () => {
      toast.success("Variant added.");
      refetchVariants();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to add variant");
    },
  });

  const deleteVariantMutation = useMutation({
    mutationFn: deleteVariant,
    onSuccess: () => {
      toast.success("Variant removed.");
      refetchVariants();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message ?? "Failed to remove variant");
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories", { limit: 100 }],
    queryFn: () => getCategories({ params: { limit: 100 } }),
    select: (res) => res.data?.data ?? res.data,
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands", { limit: 500 }],
    queryFn: () => getBrands({ params: { limit: 500 } }),
    select: (res) => {
      const raw = res.data?.data ?? res.data;
      const d = raw && typeof raw === "object" && "items" in raw ? (raw as { items?: Brand[] }) : null;
      return Array.isArray(d?.items) ? d.items : [];
    },
  });
  const brandsList: Brand[] = brandsData ?? [];

  useEffect(() => {
    if (categoriesData?.items) {
      const options: { value: string; label: string }[] = [];
      const valueMap: Record<string, { categoryId: string; subCategoryId: string }> = {};
      (categoriesData.items as Category[]).forEach((cat) => {
        cat.subCategories?.forEach((sub) => {
          if (sub._id) {
            const val = `s_${cat._id}|${sub._id}`;
            options.push({ value: val, label: `${cat.name} → ${sub.name}` });
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
    if (files?.length) {
      const list = Array.from(files);
      setImageFiles((prev) => [...prev, ...list]);
    }
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
  let categoryIdValue: string | undefined = typeof p?.categoryId === "object" ? (p?.categoryId as { _id?: string })?._id : p?.categoryId;
  let subCategoryIdValue: string | undefined = typeof p?.subCategoryId === "object" ? (p?.subCategoryId as { _id?: string })?._id : p?.subCategoryId;
  // When only subCategoryId is set (e.g. from API), derive parent categoryId from categories
  if (subCategoryIdValue && !categoryIdValue && categoriesData?.items) {
    for (const cat of categoriesData.items as Category[]) {
      const found = cat.subCategories?.some((sub) => sub._id === subCategoryIdValue);
      if (found) {
        categoryIdValue = cat._id;
        break;
      }
    }
  }
  const brandIdValue = (p as { brandId?: string })?.brandId ?? "";

  const initialValues: ProductFormValues = {
    categoryId: categoryIdValue ?? "",
    subCategoryId: subCategoryIdValue ?? "",
    name: p?.name ?? "",
    description: p?.description ?? "",
    price: p?.price ?? 0,
    isActive: p?.isActive ?? true,
    status: (p?.status as ENUM_PRODUCT_STATUS) ?? ENUM_PRODUCT_STATUS.DRAFT,
    brandId: brandIdValue || undefined,
    brandName: p?.brandName ?? "",
    showInBanner: (p as { showInBanner?: boolean })?.showInBanner ?? false,
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
            // Always derive categoryId + subCategoryId from selected subcategory so request has correct parent category
            const selVal = data.subCategoryId && data.categoryId ? `s_${data.categoryId}|${data.subCategoryId}` : "";
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
                  brandId: data.brandId || undefined,
                  brandName: data.brandName || undefined,
                  rating: data.rating,
                  comment: data.comment,
                  images: imageFiles.length > 0 ? imageFiles : undefined,
                  removedImages: removedImageIds.length > 0 ? removedImageIds : undefined,
                  bannerImage: bannerFile ?? undefined,
                  brandLogo: brandLogoFile ?? undefined,
                  showInBanner: data.showInBanner,
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
                brandId: data.brandId || undefined,
                brandName: data.brandName || undefined,
                rating: data.rating,
                comment: data.comment,
                images: imageFiles.length > 0 ? imageFiles : undefined,
                bannerImage: bannerFile ?? undefined,
                brandLogo: brandLogoFile ?? undefined,
                showInBanner: data.showInBanner,
              });
            }
          }}
        >
          {({ setFieldValue, setFieldError, values, errors }) => {
            const selVal = values.subCategoryId && values.categoryId ? `s_${values.categoryId}|${values.subCategoryId}` : "";
            const selectedBrand = values.brandId ? brandsList.find((b) => b._id === values.brandId) : null;
            const selectedBrandLogoUrl =
              selectedBrand?.images?.length ?
                getImageUrl(selectedBrand.images.find((i: BrandImage) => i.isPrimary)?.imageUrl ?? selectedBrand.images[0]?.imageUrl)
                : null;

            return (
              <Form id="product-form">
                {/* Basic information */}
                <section className="mb-8">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Basic information
                  </h3>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField label="Product Name *" labelFor="name">
                      {({ className }) => (
                        <>
                          <Field name="name" id="name" placeholder="Enter product name" maxLength={20} className={className} />
                          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </>
                      )}
                    </FormField>
                    <FormField label="Category *" labelFor="category">
                      {({ className }) => (
                        <>
                          <select
                            id="category"
                            className={className}
                            value={selVal}
                            onChange={(e) => {
                              const mapped = categoryValueMap[e.target.value];
                              if (mapped) {
                                setFieldValue("categoryId", mapped.categoryId);
                                setFieldValue("subCategoryId", mapped.subCategoryId || "");
                                setFieldError("categoryId", undefined);
                              }
                            }}
                          >
                            <option value="">Select subcategory</option>
                            {categoryOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>}
                        </>
                      )}
                    </FormField>
                    <FormField label="Price *" labelFor="price">
                      {({ className }) => (
                        <>
                          <Field name="price" id="price" type="number" min={0} step={0.01} placeholder="0" className={className} />
                          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                        </>
                      )}
                    </FormField>
                    <FormField label="Status" labelFor="status">
                      {({ className }) => (
                        <select id="status" className={className} value={values.status} onChange={(e) => setFieldValue("status", e.target.value)}>
                          {statusOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      )}
                    </FormField>
                    <FormField label="Active" labelFor="active">
                      {({ className }) => (
                        <select id="active" className={className} value={values.isActive ? "true" : "false"} onChange={(e) => setFieldValue("isActive", e.target.value === "true")}>
                          {activeOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      )}
                    </FormField>
                    <FormField label="Rating (optional)" labelFor="rating">
                      {({ className }) => (
                        <select
                          id="rating"
                          className={className}
                          value={values.rating ?? ""}
                          onChange={(e) => setFieldValue("rating", e.target.value === "" ? undefined : Number(e.target.value))}
                        >
                          <option value="">No rating</option>
                          {[0, 1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      )}
                    </FormField>
                  </div>
                </section>

                {/* Brand */}
                <section className="mb-8">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Brand
                  </h3>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField label="Select brand" labelFor="brandId">
                      {({ className }) => (
                        <select
                          id="brandId"
                          className={className}
                          value={values.brandId ?? ""}
                          onChange={(e) => {
                            const id = e.target.value || undefined;
                            const brand = id ? brandsList.find((b) => b._id === id) : null;
                            setFieldValue("brandId", id ?? "");
                            setFieldValue("brandName", brand?.brandName ?? "");
                          }}
                        >
                          <option value="">No brand</option>
                          {brandsList.map((b) => (
                            <option key={b._id} value={b._id}>
                              {b.brandName ?? b._id}
                            </option>
                          ))}
                        </select>
                      )}
                    </FormField>
                    {(selectedBrandLogoUrl || selectedBrand) && (
                      <div className="flex flex-wrap items-center gap-4">
                        {selectedBrandLogoUrl && (
                          <div>
                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-slate-400">Brand image</p>
                            <img
                              src={selectedBrandLogoUrl}
                              alt={selectedBrand?.brandName ?? "Brand"}
                              className="h-16 w-16 rounded-lg border border-gray-200 object-cover dark:border-slate-600"
                            />
                          </div>
                        )}
                        {selectedBrand && !selectedBrandLogoUrl && (
                          <p className="text-sm text-gray-600 dark:text-slate-400">{selectedBrand.brandName} (no image)</p>
                        )}
                      </div>
                    )}
                    <div className="sm:col-span-2">
                      <FormField label="Override brand logo (optional)" help="Upload a file to use as product logo instead of the brand image above.">
                      {() => (
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
                      )}
                    </FormField>
                    </div>
                  </div>
                </section>

                {/* Variants (edit mode only) */}
                {isEditMode && id && (
                  <section className="mb-8">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      Variants
                    </h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                      <p className="mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">Managed via Variant API</p>
                      {variantsData && variantsData.length > 0 && (
                        <ul className="mb-4 space-y-2">
                          {variantsData.map((v) => (
                            <li key={v._id} className="flex flex-wrap items-center gap-3 rounded border border-gray-200 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800">
                              {Array.isArray(v.images) && v.images.length > 0 && (
                                <div className="flex shrink-0 gap-1">
                                  {v.images.map((img, imgIdx) => {
                                    const src = getImageUrl(img?.imageUrl ?? (typeof img === "object" ? img : null));
                                    if (!src) return null;
                                    return (
                                      <img
                                        key={img?._id ?? img?.imageUrl ?? imgIdx}
                                        src={src}
                                        alt=""
                                        className="h-12 w-12 rounded border border-gray-200 object-cover dark:border-slate-600"
                                      />
                                    );
                                  })}
                                </div>
                              )}
                              <span className="min-w-0 flex-1 text-sm text-gray-700 dark:text-slate-300">
                                ${Number(v?.price ?? 0).toFixed(2)} · Stock: {Number(v?.stock ?? 0)}
                                {v?.sku ? ` · SKU: ${v.sku}` : ""}
                                {Object.keys(v?.attributes ?? {}).length ? ` · ${Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(", ")}` : ""}
                              </span>
                              <Button
                                type="button"
                                label="Delete"
                                color="danger"
                                small
                                outline
                                onClick={() => deleteVariantMutation.mutate(v._id)}
                                disabled={deleteVariantMutation.isPending}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-slate-400">Add new variant</p>
                        <div className="flex flex-wrap gap-2">
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            placeholder="Price"
                            value={newVariantPrice}
                            onChange={(e) => setNewVariantPrice(e.target.value)}
                            className={inputClass}
                          />
                          <input
                            type="number"
                            min={0}
                            placeholder="Stock"
                            value={newVariantStock}
                            onChange={(e) => setNewVariantStock(e.target.value)}
                            className={inputClass}
                          />
                          <input
                            type="text"
                            placeholder="SKU (optional)"
                            value={newVariantSku}
                            onChange={(e) => setNewVariantSku(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 dark:text-slate-400">Attributes (e.g. Size: M, Color: Red)</p>
                          {(newVariantAttrs).map((attr, idx) => (
                            <div key={idx} className="flex flex-wrap gap-2">
                              <input
                                type="text"
                                placeholder="Name"
                                value={attr.name}
                                onChange={(e) => setNewVariantAttrs((prev) => prev.map((a, i) => (i === idx ? { ...a, name: e.target.value } : a)))}
                                className="min-w-[80px] rounded border border-gray-700 px-2 py-1.5 text-sm dark:bg-slate-800 dark:border-slate-600"
                              />
                              <input
                                type="text"
                                placeholder="Value"
                                value={attr.value}
                                onChange={(e) => setNewVariantAttrs((prev) => prev.map((a, i) => (i === idx ? { ...a, value: e.target.value } : a)))}
                                className="min-w-[80px] rounded border border-gray-700 px-2 py-1.5 text-sm dark:bg-slate-800 dark:border-slate-600"
                              />
                              <Button type="button" label="−" color="danger" small outline onClick={() => setNewVariantAttrs((prev) => prev.filter((_, i) => i !== idx))} />
                            </div>
                          ))}
                          <Button type="button" label="+ Add attribute row" color="whiteDark" small outline onClick={() => setNewVariantAttrs((prev) => [...prev, { name: "", value: "" }])} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 dark:text-slate-400">Variant images (optional)</p>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            id="variant-images-input"
                            className="hidden"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files?.length) setNewVariantImages((prev) => [...prev, ...Array.from(files)]);
                              e.target.value = "";
                            }}
                          />
                          <Button
                            type="button"
                            label="Add images"
                            icon={mdiUpload}
                            color="whiteDark"
                            small
                            outline
                            onClick={() => document.getElementById("variant-images-input")?.click()}
                          />
                          {newVariantImages.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {newVariantImages.map((file, idx) => (
                                <div key={`${file.name}-${idx}`} className="relative">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt=""
                                    className="h-16 w-16 rounded-lg border border-gray-200 object-cover dark:border-slate-600"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setNewVariantImages((prev) => prev.filter((_, i) => i !== idx))}
                                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                  >
                                    <Icon path={mdiClose} size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          label="Add variant"
                          color="info"
                          small
                          onClick={() => {
                            const price = parseFloat(newVariantPrice);
                            const stock = parseInt(newVariantStock, 10);
                            if (Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0) {
                              toast.error("Please enter valid price and stock.");
                              return;
                            }
                            const attributes: Record<string, string> = {};
                            newVariantAttrs.forEach((a) => {
                              if (a.name?.trim()) attributes[a.name.trim()] = a.value?.trim() ?? "";
                            });
                            createVariantMutation.mutate(
                              {
                                productId: id,
                                price,
                                stock,
                                sku: newVariantSku.trim() || undefined,
                                attributes,
                                images: newVariantImages.length > 0 ? newVariantImages : undefined,
                              },
                              {
                                onSuccess: () => {
                                  setNewVariantPrice("");
                                  setNewVariantStock("");
                                  setNewVariantSku("");
                                  setNewVariantAttrs([{ name: "", value: "" }]);
                                  setNewVariantImages([]);
                                },
                              }
                            );
                          }}
                          disabled={createVariantMutation.isPending}
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* Description & comment */}
                <section className="mb-8">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Description & comment
                  </h3>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                    <FormField label="Comment" labelFor="comment" hasTextareaHeight>
                      {({ className }) => (
                        <Field as="textarea" name="comment" id="comment" placeholder="Comment" maxLength={500} rows={2} className={className} />
                      )}
                    </FormField>
                  </div>
                  </div>
                </section>

                {/* Media */}
                <section className="mb-8">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Media
                  </h3>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField label="Banner image">
                    {() => (
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
                    )}
                  </FormField>
                  <FormField label="Show in banner" help="Enable to show this product in the banner. Ensure a banner image is set.">
                    {() => (
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!values.showInBanner}
                          onChange={(e) => setFieldValue("showInBanner", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-700 text-blue-600 focus:ring-blue-600 dark:border-slate-600 dark:bg-slate-800"
                        />
                        <span className="text-sm text-gray-700 dark:text-slate-300">Show this product in banner</span>
                      </label>
                    )}
                  </FormField>
                  <div className="sm:col-span-2">
                  <FormField label="Product images">
                    {() => (
                      <>
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
                        <input
                          ref={productImagesInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          id="product-images"
                          onChange={handleImagesChange}
                        />
                        <Button
                          type="button"
                          label="Add images"
                          icon={mdiUpload}
                          color="info"
                          small
                          onClick={() => productImagesInputRef.current?.click()}
                        />
                        {imageFiles.length > 0 ? (
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
                        ) : null}
                      </>
                    )}
                  </FormField>
                  </div>
                  </div>
                </section>
              </Form>
            );
          }}
        </Formik>
      </CardBox>
    </div>
  );
}
