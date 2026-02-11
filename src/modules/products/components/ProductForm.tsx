import { useEffect, useState, useCallback } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import ImageUpload from "../../../components/form/ImageUpload";
import { createProduct, updateProduct, getProductById } from "../api";
import { getCategories } from "../../categories/api";
import { productSchema } from "../validations";
import { ProductFormValues, ENUM_PRODUCT_STATUS } from "../type";
import { Category } from "../../categories/type";
import { useUser } from "../../../context/UserDataContext";
import { Upload, X } from "lucide-react";

const statusOptions = [
  { value: ENUM_PRODUCT_STATUS.DRAFT, label: "Draft" },
  { value: ENUM_PRODUCT_STATUS.SAVED, label: "Saved" },
  { value: ENUM_PRODUCT_STATUS.PUBLISH, label: "Publish" },
];

const activeOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

function ProductForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const isEditMode = !!id;

  // Single dropdown: categories and subcategories (subcategories indented under parent)
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  // Map dropdown value -> { categoryId, subCategoryId } for applying selection
  const [categoryValueMap, setCategoryValueMap] = useState<
    Record<string, { categoryId: string; subCategoryId: string }>
  >({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // Store original image objects from backend for tracking _id
  const [existingImageObjects, setExistingImageObjects] = useState<
    { _id: string; imageUrl: string }[]
  >([]);
  // URLs for display in ImageUpload component
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // Store image _ids for removal
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  const [logoImagePreview, setLogoImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [existingBannerImage, setExistingBannerImage] = useState<string | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);



  const handleImagesChange = useCallback((files: File[]) => {
    setImageFiles(files);
  }, []);

  const handleRemoveExistingImage = useCallback(
    (index: number) => {
      const imageToRemove = existingImageObjects[index];
      if (imageToRemove?._id) {
        setRemovedImageIds((prev) => [...prev, imageToRemove._id]);
      }
      setExistingImageObjects((prev) => prev.filter((_, i) => i !== index));
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    },
    [existingImageObjects]
  );

  const handleLogoImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setBrandLogoFile(file);
        setLogoImagePreview(URL.createObjectURL(file));
      }
      e.target.value = "";
    },
    []
  );

  const removeLogoImage = useCallback(() => {
    setBrandLogoFile(null);
    setLogoImagePreview(null);
    setExistingImage(null);
  }, []);

  const handleBannerImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setBannerImageFile(file);
        setBannerImagePreview(URL.createObjectURL(file));
      }
      e.target.value = "";
    },
    []
  );

  const removeBannerImage = useCallback(() => {
    setBannerImageFile(null);
    setBannerImagePreview(null);
    setExistingBannerImage(null);
  }, []);

  // Fetch product data for edit mode
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: isEditMode,
    select: (response) => response.data.data,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories", { limit: 100 }],
    queryFn: () => getCategories({ params: { limit: 100 } }),
    select: (response) => response.data.data,
  });

  // Build single dropdown: categories and subcategories (subcategories under parent with ↳)
  useEffect(() => {
    if (categoriesData?.items) {
      const options: { value: string; label: string }[] = [];
      const valueMap: Record<string, { categoryId: string; subCategoryId: string }> = {};

      categoriesData.items.forEach((cat: Category) => {
        options.push({
          value: `c_${cat._id}`,
          label: cat.name,
        });
        valueMap[`c_${cat._id}`] = { categoryId: cat._id, subCategoryId: "" };

        if (cat.subCategories && cat.subCategories.length > 0) {
          cat.subCategories.forEach((sub) => {
            if (sub._id) {
              const val = `s_${cat._id}|${sub._id}`;
              options.push({
                value: val,
                label: `  ↳ ${sub.name}`,
              });
              valueMap[val] = { categoryId: cat._id, subCategoryId: sub._id };
            }
          });
        }
      });

      setCategoryOptions(options);
      setCategoryValueMap(valueMap);
    }
  }, [categoriesData]);

  const { isPending: isCreating, mutate: createMutate } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to create product");
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
      toast.error(error?.response?.data?.message || "Failed to update product");
    },
  });

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      categoryId: "",
      subCategoryId: "",
      name: "",
      description: "",
      price: 0,
      isActive: true,
      status: ENUM_PRODUCT_STATUS.DRAFT,
      brandName: "",
      brandLogo: "",
      bannerImage: "",
      rating: undefined as number | undefined,
      comment: "",
    },
    validationSchema: productSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: (data) => {
      if (isEditMode) {
        updateMutate({
          id,
          data: {
            categoryId: data.categoryId,
            subCategoryId: data.subCategoryId || undefined,
            name: data.name,
            description: data.description,
            price: data.price,
            isActive: data.isActive,
            status: data.status,
            images: imageFiles,
            removedImages:
              removedImageIds.length > 0 ? removedImageIds : [],
            brandName: data.brandName,
            brandLogo: brandLogoFile ?? data.brandLogo,
            bannerImage: bannerImageFile ?? data.bannerImage,
            rating: data.rating,
            comment: data.comment,
          },
        });
      } else {
        if (!user?._id) {
          toast.error("User not found. Please login again.");
          return;
        }
        createMutate({
          categoryId: data.categoryId,
          ...(data.subCategoryId && { subCategoryId: data.subCategoryId }),
          userId: user._id,
          name: data.name,
          description: data.description,
          price: data.price,
          isActive: data.isActive,
          status: data.status,
          images: imageFiles,
          brandName: data.brandName,
          brandLogo: brandLogoFile ?? undefined,
          bannerImage: bannerImageFile ?? undefined,
          rating: data.rating,
          comment: data.comment,
        });
      }
    },
  });

  // Populate form when product data is loaded
  useEffect(() => {
    if (productData) {
      // Handle categoryId being an object or string
      const categoryIdValue =
        typeof productData.categoryId === "object"
          ? (productData.categoryId as { _id?: string })?._id
          : productData.categoryId;

          // Handle subCategoryId being an object or string
      const subCategoryIdValue =
        typeof productData.subCategoryId === "object"
          ? (productData.subCategoryId as { _id?: string })?._id
          : productData.subCategoryId;

      formik.setValues({
        categoryId: categoryIdValue || "",
        subCategoryId: subCategoryIdValue || "",
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price || 0,
        isActive: productData.isActive ?? true,
        status: productData.status || ENUM_PRODUCT_STATUS.DRAFT,
        brandName: productData.brandName ?? "",
        brandLogo: productData.brandLogo ?? "",
        bannerImage: productData.bannerImage ?? "",
        rating: productData.rating ?? undefined,
        comment: productData.comment ?? "",
      });
      if (productData.brandLogo) {
        setExistingImage(productData.brandLogo);
      }
      if (productData.bannerImage) {
        setExistingBannerImage(productData.bannerImage);
      }
      if (productData.images && productData.images.length > 0) {
        // Cast to proper type since backend returns objects, not strings
        const images = productData.images as unknown as {
          _id?: string;
          imageUrl?: string;
        }[];
        // Store original image objects for tracking _id
        const imageObjects = images.map((img) => ({
          _id: img._id || "",
          imageUrl: img.imageUrl || "",
        }));
        setExistingImageObjects(imageObjects);
        // Store URLs for display
        setExistingImages(imageObjects.map((img) => img.imageUrl));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData]);

  const isPending = isCreating || isUpdating;

  // Selected value for the single category+subcategory dropdown
  const selectedCategoryValue =
    formik.values.subCategoryId && formik.values.categoryId
      ? `s_${formik.values.categoryId}|${formik.values.subCategoryId}`
      : formik.values.categoryId
        ? `c_${formik.values.categoryId}`
        : "";

  const handleCategoryOptionChange = useCallback(
    (value: string) => {
      const mapped = categoryValueMap[value];
      if (mapped) {
        formik.setFieldValue("categoryId", mapped.categoryId);
        formik.setFieldValue("subCategoryId", mapped.subCategoryId);
      }
    },
    [categoryValueMap, formik]
  );

  if (isEditMode && isLoadingProduct) {
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
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEditMode
              ? "Update the product details below."
              : "Fill in the details to create a new product."}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Product Name */}
            <div>
              <Label>
                Product Name<span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="Enter product name"
                type="text"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                maxLength={20}
              />
              {formik.errors.name && formik.touched.name && (
                <p className="text-error-500 text-sm mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Category / SubCategory (single dropdown: categories and subcategories) */}
            <div>
              <Label>
                Category<span className="text-error-500">*</span>
              </Label>
              <Select
                name="categoryId"
                options={categoryOptions}
                placeholder="Select category or subcategory"
                value={selectedCategoryValue}
                onChange={handleCategoryOptionChange}
              />
              {formik.errors.categoryId && formik.touched.categoryId && (
                <p className="text-error-500 text-sm mt-1">
                  {formik.errors.categoryId}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <Label>
                Price<span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="Enter price"
                type="number"
                name="price"
                min={0}
                step={0.01}
                onChange={formik.handleChange}
                value={formik.values.price}
              />
              {formik.errors.price && formik.touched.price && (
                <p className="text-error-500 text-sm mt-1">
                  {formik.errors.price}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <Select
                name="status"
                options={statusOptions}
                placeholder="Select status"
                value={formik.values.status}
                onChange={(value) => formik.setFieldValue("status", value)}
              />
              {formik.errors.status && formik.touched.status && (
                <p className="text-error-500 text-sm mt-1">
                  {formik.errors.status}
                </p>
              )}
            </div>

            {/* Active Status */}
            <div>
              <Label>Active Status</Label>
              <Select
                name="isActive"
                options={activeOptions}
                placeholder="Select active status"
                value={formik.values.isActive ? "true" : "false"}
                onChange={(value) =>
                  formik.setFieldValue("isActive", value === "true")
                }
              />
            </div>

            {/* Brand Name */}
            <div>
              <Label>Brand Name</Label>
              <Input
                placeholder="Enter brand name"
                type="text"
                name="brandName"
                onChange={formik.handleChange}
                value={formik.values.brandName ?? ""}
              />
            </div>

            {/* Rating */}
            <div>
              <Label>Rating</Label>
              <Input
                placeholder="0-5"
                type="number"
                name="rating"
                min={0}
                max={5}
                step={0.1}
                onChange={formik.handleChange}
                value={formik.values.rating ?? ""}
              />
            </div>

            {/* Product Logo (Brand Logo) */}
            <div>
              <Label>Product Logo</Label>
              <div className="flex items-center gap-4">
                {logoImagePreview || existingImage ? (
                  <div className="relative">
                    <img
                      src={logoImagePreview || existingImage || ""}
                      alt="Brand logo preview"
                      className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeLogoImage}
                      className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoImageChange}
                      className="hidden"
                    />
                    <Upload className="h-6 w-6 text-gray-400" />
                  </label>
                )}
              </div>
            </div>

            {/* Banner Image */}
            <div>
              <Label>Banner Image</Label>
              <div className="flex items-center gap-4">
                {bannerImagePreview || existingBannerImage ? (
                  <div className="relative">
                    <img
                      src={bannerImagePreview || existingBannerImage || ""}
                      alt="Banner preview"
                      className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeBannerImage}
                      className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerImageChange}
                      className="hidden"
                    />
                    <Upload className="h-6 w-6 text-gray-400" />
                  </label>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="sm:col-span-2">
              <Label>Comment</Label>
              <textarea
                placeholder="Comment"
                name="comment"
                onChange={formik.handleChange}
                value={formik.values.comment ?? ""}
                maxLength={500}
                rows={2}
                className="h-auto w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formik.values.comment?.length || 0}/500 characters
              </p>
            </div>

            {/* Description - Full Width */}
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <textarea
                placeholder="Enter product description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                maxLength={255}
                rows={4}
                className="h-auto w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 resize-none"
              />
              {formik.errors.description && formik.touched.description && (
                <p className="text-error-500 text-sm mt-1">
                  {formik.errors.description}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {formik.values.description?.length || 0}/255 characters
              </p>
            </div>

            {/* Product Images - Full Width */}
            <div className="sm:col-span-2">
              <Label>Product Images</Label>
              <ImageUpload
                onChange={handleImagesChange}
                maxFiles={5}
                maxSizeInMB={5}
                existingImages={isEditMode ? existingImages : undefined}
                onRemoveExisting={
                  isEditMode ? handleRemoveExistingImage : undefined
                }
              />
            </div>

            {/* Buttons */}
            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/products")}
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
                  ? "Update Product"
                  : "Create Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
