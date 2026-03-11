import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { mdiPlus, mdiTrashCan } from "@mdi/js";

import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import Icon from "../../_components/Icon";
import { toast } from "../../_lib/toast";
import { getImageUrl } from "../../../shared/constant";
import { createBrand, getBrandById, updateBrand, buildBrandFormData } from "../api";
import { brandSchema } from "../validations";
import type { Brand, BrandImage } from "../interface";

const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/gif";

export default function BrandForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  const { data: brandData, isLoading: isLoadingBrand, isError: isBrandError } = useQuery({
    queryKey: ["brand", id],
    queryFn: () => getBrandById(id!),
    enabled: isEditMode,
    select: (response) => (response.data as { data?: Brand }).data ?? response.data,
  });

  const { isPending: isCreating, mutate: createMutate } = useMutation({
    mutationFn: (data: FormData) => createBrand(data),
    onSuccess: () => {
      toast.success("Brand created successfully!");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      navigate("/brands");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to create brand");
    },
  });

  const { isPending: isUpdating, mutate: updateMutate } = useMutation({
    mutationFn: ({
      id: brandId,
      data,
    }: {
      id: string;
      data: FormData | { brandName?: string; description?: string };
    }) => updateBrand({ id: brandId, data }),
    onSuccess: () => {
      toast.success("Brand updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brand", id] });
      navigate("/brands");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to update brand");
    },
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setImageFiles((prev) => [...prev, ...newFiles]);
    setPrimaryImageIndex((prev) => (prev < 0 && newFiles.length > 0 ? 0 : prev));
    e.target.value = "";
  }, []);

  const removeImageFile = useCallback((index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPrimaryImageIndex((prev) => {
      if (prev === index) return 0;
      if (prev > index) return prev - 1;
      return prev;
    });
  }, []);

  const isPending = isCreating || isUpdating;

  if (isEditMode && isLoadingBrand) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
      </div>
    );
  }

  if (isEditMode && isBrandError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-gray-600 dark:text-slate-400">Brand not found or you don&apos;t have access.</p>
        <Button
          type="button"
          label="← Back to Brands"
          color="whiteDark"
          outline
          onClick={() => navigate("/brands")}
        />
      </div>
    );
  }

  const initialValues = {
    brandName: (brandData as Brand)?.brandName ?? "",
    description: (brandData as Brand)?.description ?? "",
  };

  return (
    <div className="h-full overflow-y-auto">
      <CardBox
        footer={
          <Buttons className="!justify-between">
            <Button
              type="button"
              label={isEditMode ? "← Back to Brands" : "Cancel"}
              color="whiteDark"
              outline
              onClick={() => navigate("/brands")}
              isGrouped
            />
            <Buttons className="!justify-end">
              <Button
                type="submit"
                form="brand-form"
                label={
                  isPending
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                    ? "Update Brand"
                    : "Create Brand"
                }
                color="info"
                disabled={isPending}
                isGrouped
              />
            </Buttons>
          </Buttons>
        }
      >
        <h2 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-slate-100">
          {isEditMode ? "Edit Brand" : "Add New Brand"}
        </h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-slate-400">
          {isEditMode
            ? "Update the brand details below."
            : "Fill in the details to create a new brand."}
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={brandSchema}
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(data) => {
            const brandName = data.brandName.trim();
            const description = data.description?.trim() || undefined;

            if (isEditMode) {
              if (imageFiles.length > 0) {
                const formData = buildBrandFormData({
                  brandName,
                  description,
                  images: imageFiles,
                });
                updateMutate({ id: id!, data: formData });
              } else {
                updateMutate({ id: id!, data: { brandName, description } });
              }
            } else {
              const formData = buildBrandFormData({
                brandName,
                description,
                images: imageFiles.length > 0 ? imageFiles : undefined,
              });
              createMutate(formData);
            }
          }}
        >
          {({ errors }) => (
            <Form id="brand-form">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FormField label="Brand Name *" labelFor="brandName">
                      {({ className }) => (
                        <>
                          <Field
                            name="brandName"
                            id="brandName"
                            placeholder="Enter brand name"
                            className={className}
                          />
                          {errors.brandName && (
                            <p className="mt-1 text-sm text-red-500">{errors.brandName}</p>
                          )}
                        </>
                      )}
                    </FormField>
                  </div>

                  <div className="sm:col-span-2">
                    <FormField label="Description" labelFor="description" hasTextareaHeight>
                      {({ className }) => (
                        <>
                          <Field
                            as="textarea"
                            name="description"
                            id="description"
                            placeholder="Enter brand description (optional)"
                            rows={3}
                            className={className}
                          />
                          {errors.description && (
                            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                          )}
                        </>
                      )}
                    </FormField>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Images (optional)
                    </label>
                    {isEditMode && brandData && ((brandData as Brand).images?.length ?? 0) > 0 && (
                      <div className="mb-3 mt-1.5">
                        <p className="mb-2 text-xs text-gray-500 dark:text-slate-400">Current images</p>
                        <div className="flex flex-wrap gap-2">
                          {((brandData as Brand).images as BrandImage[]).map((img) => (
                            <img
                              key={img._id ?? img.imageUrl}
                              src={getImageUrl(img.imageUrl)}
                              alt=""
                              className="h-20 w-20 rounded-lg border border-gray-200 object-cover dark:border-slate-600"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="mb-2 mt-1 text-xs text-gray-500 dark:text-slate-400">
                      Upload images. Click &quot;Add images&quot; to select one or more files. First image is
                      primary by default; click &quot;Set primary&quot; on another to change.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPT_IMAGES}
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      label="Add images"
                      icon={mdiPlus}
                      color="info"
                      small
                      onClick={() => fileInputRef.current?.click()}
                    />

                    {imageFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {imageFiles.map((file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-slate-600 dark:bg-slate-800/50"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt=""
                              className="h-24 w-24 object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                type="button"
                                label={primaryImageIndex === index ? "Primary" : "Set primary"}
                                color="info"
                                small
                                onClick={() => setPrimaryImageIndex(index)}
                              />
                              <Button
                                type="button"
                                color="danger"
                                icon={mdiTrashCan}
                                small
                                onClick={() => removeImageFile(index)}
                                title="Remove"
                              />
                            </div>
                            {primaryImageIndex === index && (
                              <span className="absolute left-1 top-1 rounded bg-blue-600 px-1.5 py-0.5 text-xs font-medium text-white">
                                Primary
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </div>
  );
}
