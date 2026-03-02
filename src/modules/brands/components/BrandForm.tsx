import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Trash2 } from "lucide-react";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { createBrand, getBrandById, updateBrand, buildBrandFormData } from "../api";
import { brandSchema } from "../validations";
import { Brand, BrandImage } from "../type";
import { getImageUrl } from "../../../shared/constant";

type BrandFormValues = {
    brandName: string;
    description: string;
};

const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/gif";

function BrandForm() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

    const { data: brandData, isLoading: isLoadingBrand } = useQuery({
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
        mutationFn: ({ id: brandId, data }: { id: string; data: FormData | { brandName?: string; description?: string } }) =>
            updateBrand({ id: brandId, data }),
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

    const formik = useFormik<BrandFormValues>({
        initialValues: {
            brandName: "",
            description: "",
        },
        validationSchema: brandSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: (data) => {
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
        },
    });

    useEffect(() => {
        if (brandData) {
            const b = brandData as Brand;
            formik.setValues({
                brandName: (b.brandName as string) || "",
                description: (b.description as string) || "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brandData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
        setImageFiles((prev) => [...prev, ...newFiles]);
        if (primaryImageIndex < 0 && newFiles.length > 0) setPrimaryImageIndex(0);
        e.target.value = "";
    };

    const removeImageFile = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setPrimaryImageIndex((prev) => {
            if (prev === index) return 0;
            if (prev > index) return prev - 1;
            return prev;
        });
    };

    const isPending = isCreating || isUpdating;

    if (isEditMode && isLoadingBrand) {
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
                        {isEditMode ? "Edit Brand" : "Add New Brand"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEditMode
                            ? "Update the brand details below."
                            : "Fill in the details to create a new brand."}
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Label>
                                Brand Name <span className="text-error-500">*</span>
                            </Label>
                            <Input
                                placeholder="Enter brand name"
                                type="text"
                                name="brandName"
                                onChange={formik.handleChange}
                                value={formik.values.brandName}
                                className="mt-1.5"
                            />
                            {formik.errors.brandName && formik.touched.brandName && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.brandName}</p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <Label>Description</Label>
                            <textarea
                                name="description"
                                placeholder="Enter brand description (optional)"
                                rows={3}
                                onChange={formik.handleChange}
                                value={formik.values.description}
                                className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                            />
                            {formik.errors.description && formik.touched.description && (
                                <p className="text-error-500 text-sm mt-1">{formik.errors.description}</p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <Label>Images (optional)</Label>
                            {isEditMode && brandData && ((brandData as Brand).images?.length ?? 0) > 0 && (
                                <div className="mt-1.5 mb-3">
                                    <p className="text-xs text-gray-500 mb-2">Current images</p>
                                    <div className="flex flex-wrap gap-2">
                                        {((brandData as Brand).images as BrandImage[]).map((img) => (
                                            <img
                                                key={img._id ?? img.imageUrl}
                                                src={getImageUrl(img.imageUrl)}
                                                alt=""
                                                className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1 mb-2">
                                Upload images. Click &quot;Add images&quot; to select one or more files. First image is primary by default; click &quot;Set primary&quot; on another to change.
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ACCEPT_IMAGES}
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-brand-600 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100"
                            >
                                <ImagePlus className="h-4 w-4" /> Add images
                            </button>

                            {imageFiles.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-3">
                                    {imageFiles.map((file, index) => (
                                        <div
                                            key={`${file.name}-${index}`}
                                            className="relative group rounded-lg border border-gray-200 overflow-hidden bg-gray-50"
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt=""
                                                className="h-24 w-24 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setPrimaryImageIndex(index)}
                                                    className="px-2 py-1 text-xs font-medium text-white bg-brand-600 rounded hover:bg-brand-700"
                                                >
                                                    {primaryImageIndex === index ? "Primary" : "Set primary"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageFile(index)}
                                                    className="p-1.5 text-white bg-red-600 rounded hover:bg-red-700"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            {primaryImageIndex === index && (
                                                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-medium bg-brand-600 text-white">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/brands")}
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
                                      ? "Update Brand"
                                      : "Create Brand"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BrandForm;
