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
import VariantSection from "./VariantSection";
import LocalVariantSection from "./LocalVariantSection";
import { createProduct, updateProduct, getProductById, addProductImages, removeProductImage } from "../api";
import { createVariant } from "../variantApi";
import { getCategories } from "../../categories/api";
import { productSchema } from "../validations";
import { ProductFormValues, ENUM_PRODUCT_STATUS, VariantAttributes } from "../type";
import { Category } from "../../categories/type";
import { useUser } from "../../../context/UserDataContext";

// Type for local variants (before product is created)
export type LocalVariant = {
  id: string; // temporary local ID
  attributes: VariantAttributes;
  price: number;
  stock: number;
  images: File[];
};

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

  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // Store original image objects from backend for tracking _id and imageUrl
  const [existingImageObjects, setExistingImageObjects] = useState<
    { _id: string; imageUrl: string }[]
  >([]);
  // URLs for display in ImageUpload component
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // Track removed image URLs to delete on save
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  // Local variants for create mode (stored locally until product is created)
  const [localVariants, setLocalVariants] = useState<LocalVariant[]>([]);
  const [isCreatingVariants, setIsCreatingVariants] = useState(false);
  const [isSavingImages, setIsSavingImages] = useState(false);

  const handleImagesChange = useCallback((files: File[]) => {
    setImageFiles(files);
  }, []);

  const handleRemoveExistingImage = useCallback(
    (index: number) => {
      // Get the original URL before removing
      const imageToRemove = existingImageObjects[index];
      if (imageToRemove?.imageUrl) {
        setRemovedImageUrls((prev) => [...prev, imageToRemove.imageUrl]);
      }
      setExistingImageObjects((prev) => prev.filter((_, i) => i !== index));
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    },
    [existingImageObjects]
  );

  // Local variant handlers for create mode
  const handleAddLocalVariant = useCallback((variant: LocalVariant) => {
    setLocalVariants((prev) => [...prev, variant]);
  }, []);

  const handleUpdateLocalVariant = useCallback((updatedVariant: LocalVariant) => {
    setLocalVariants((prev) =>
      prev.map((v) => (v.id === updatedVariant.id ? updatedVariant : v))
    );
  }, []);

  const handleRemoveLocalVariant = useCallback((variantId: string) => {
    setLocalVariants((prev) => prev.filter((v) => v.id !== variantId));
  }, []);

  // Fetch product data for edit mode - ensure id is valid
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: isEditMode && !!id && id !== "undefined",
    select: (response) => response.data.data,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories", { limit: 100 }],
    queryFn: () => getCategories({ params: { limit: 100 } }),
    select: (response) => response.data.data,
  });

  useEffect(() => {
    if (categoriesData?.items) {
      const options: { value: string; label: string }[] = [];

      categoriesData.items.forEach((cat: Category) => {
        options.push({
          value: cat._id,
          label: cat.name,
        });

        if (cat.subCategories && cat.subCategories.length > 0) {
          cat.subCategories.forEach((sub) => {
            if (sub._id) {
              options.push({
                value: sub._id,
                label: `  ↳ ${sub.name}`,
              });
            }
          });
        }
      });

      setCategoryOptions(options);
    }
  }, [categoriesData]);

  const { isPending: isCreating, mutate: createMutate } = useMutation({
    mutationFn: createProduct,
    onSuccess: async (response) => {
      // Handle different possible response structures
      const responseData = response.data as Record<string, unknown>;
      const nestedData = responseData?.data as Record<string, unknown> | undefined;
      
      // Try to extract productId from various possible locations
      const productId = 
        nestedData?.productId as string | undefined ||
        nestedData?._id as string | undefined ||
        responseData?.productId as string | undefined ||
        responseData?._id as string | undefined;
      
      // If there are local variants, create them now
      if (localVariants.length > 0 && productId) {
        setIsCreatingVariants(true);
        try {
          await Promise.all(
            localVariants.map((variant) =>
              createVariant({
                productId,
                attributes: variant.attributes,
                price: variant.price,
                stock: variant.stock,
                images: variant.images.length > 0 ? variant.images : undefined,
              })
            )
          );
          toast.success(`Product created with ${localVariants.length} variant(s)!`);
          queryClient.invalidateQueries({ queryKey: ["products"] });
          navigate("/products");
        } catch {
          toast.warning("Product created but some variants failed to save. You can add them now.");
          queryClient.invalidateQueries({ queryKey: ["products"] });
          // Redirect to edit page so user can fix/add variants
          navigate(`/products/edit/${productId}`);
        } finally {
          setIsCreatingVariants(false);
        }
      } else if (productId) {
        // No variants added - redirect to edit page with helpful message
        toast.success(
          "Product created! You can now add variants.",
          { autoClose: 5000 }
        );
        queryClient.invalidateQueries({ queryKey: ["products"] });
        // Redirect to edit page so user can add variants
        navigate(`/products/edit/${productId}`);
      } else {
        // Fallback if productId not found in response
        toast.success("Product created successfully!");
        queryClient.invalidateQueries({ queryKey: ["products"] });
        navigate("/products");
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to create product");
    },
  });

  const { isPending: isUpdating, mutate: updateMutate } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Product updated successfully!");
      setRemovedImageUrls([]);
      setImageFiles([]);
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
      name: "",
      description: "",
      price: 0,
      isActive: true,
      status: ENUM_PRODUCT_STATUS.DRAFT,
    },
    validationSchema: productSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (data) => {
      if (isEditMode && id) {
        setIsSavingImages(true);
        try {
          // 1. Remove deleted images
          if (removedImageUrls.length > 0) {
            await Promise.all(
              removedImageUrls.map((imageUrl) => removeProductImage(id, imageUrl))
            );
          }
          
          // 2. Add new images
          if (imageFiles.length > 0) {
            await addProductImages(id, imageFiles);
          }
          
          // 3. Update product details (without images)
          updateMutate({
            id,
            data: {
              categoryId: data.categoryId,
              name: data.name,
              description: data.description,
              price: data.price,
              isActive: data.isActive,
              status: data.status,
            },
          });
        } catch (error) {
          toast.error("Failed to update images");
        } finally {
          setIsSavingImages(false);
        }
      } else {
        if (!user?._id) {
          toast.error("User not found. Please login again.");
          return;
        }
        createMutate({
          ...data,
          userId: user._id,
          images: imageFiles,
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

      formik.setValues({
        categoryId: categoryIdValue || "",
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price || 0,
        isActive: productData.isActive ?? true,
        status: productData.status || ENUM_PRODUCT_STATUS.DRAFT,
      });
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

  const isPending = isCreating || isUpdating || isCreatingVariants || isSavingImages;

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

            {/* Category */}
            <div>
              <Label>
                Category<span className="text-error-500">*</span>
              </Label>
              <Select
                name="categoryId"
                options={categoryOptions}
                placeholder="Select category"
                value={formik.values.categoryId}
                onChange={(value) => formik.setFieldValue("categoryId", value)}
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

            {/* Variants Section */}
            <div className="sm:col-span-2">
              {isEditMode && id && id !== "undefined" ? (
                <VariantSection productId={id} />
              ) : (
                <LocalVariantSection
                  variants={localVariants}
                  onAdd={handleAddLocalVariant}
                  onUpdate={handleUpdateLocalVariant}
                  onRemove={handleRemoveLocalVariant}
                />
              )}
            </div>

            {/* Buttons */}
            <div className="sm:col-span-2 flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-600 transition hover:text-gray-800"
              >
                ← Back to Products
              </button>
              <div className="flex items-center gap-3">
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
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
