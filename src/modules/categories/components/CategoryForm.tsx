import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, X, Upload, Trash2 } from "lucide-react";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import {
  createCategory,
  getCategoryById,
  updateCategory,
  addSubCategory,
  deleteSubCategory,
} from "../api";
import { categorySchema, categoryWithSubsSchema } from "../validations";
import { SubCategory, SubCategoryFormValues } from "../type";
import { getImageUrl } from "../../../shared/constant";

type SubCategoryWithImage = SubCategoryFormValues & {
  imageFile?: File;
  imagePreview?: string;
};

const activeOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

function CategoryForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  
  // For create mode - local subcategories
  const [newSubCategories, setNewSubCategories] = useState<SubCategoryWithImage[]>([]);
  
  // For edit mode - existing subcategories from server
  const [existingSubCategories, setExistingSubCategories] = useState<SubCategory[]>([]);
  
  // For edit mode - add new subcategory form
  const [showAddSubForm, setShowAddSubForm] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubDescription, setNewSubDescription] = useState("");
  const [newSubImage, setNewSubImage] = useState<File | null>(null);
  const [newSubImagePreview, setNewSubImagePreview] = useState<string | null>(null);

  // Fetch category data for edit mode
  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id!),
    enabled: isEditMode,
    select: (response) => response.data.data,
  });

  // Create mutation
  const { isPending: isCreating, mutate: createMutate } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/categories");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to create category");
    },
  });

  // Update mutation
  const { isPending: isUpdating, mutate: updateMutate } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to update category");
    },
  });

  // Add subcategory mutation (edit mode only)
  const { isPending: isAddingSub, mutate: addSubMutate } = useMutation({
    mutationFn: addSubCategory,
    onSuccess: () => {
      toast.success("Subcategory added successfully!");
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      setShowAddSubForm(false);
      setNewSubName("");
      setNewSubDescription("");
      setNewSubImage(null);
      if (newSubImagePreview) {
        URL.revokeObjectURL(newSubImagePreview);
        setNewSubImagePreview(null);
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to add subcategory");
    },
  });

  // Delete subcategory mutation (edit mode only)
  const { mutate: deleteSubMutate } = useMutation({
    mutationFn: ({ categoryId, subCategoryId }: { categoryId: string; subCategoryId: string }) =>
      deleteSubCategory(categoryId, subCategoryId),
    onSuccess: () => {
      toast.success("Subcategory deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["category", id] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to delete subcategory");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      isActive: true,
    },
    validationSchema: isEditMode ? categorySchema : categoryWithSubsSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: (data) => {
      if (isEditMode) {
        updateMutate({
          categoryId: id,
          data: {
            name: data.name,
            description: data.description,
            isActive: data.isActive,
            image: categoryImage || undefined,
          },
        });
      } else {
        // Filter out subcategories with empty names
        const validSubCategories = newSubCategories.filter((sub) => sub.name.trim() !== "");
        const subCategoryData = validSubCategories.map((sub) => ({
          name: sub.name.trim(),
          description: sub.description?.trim() || "",
        }));
        const subImages = validSubCategories
          .map((sub) => sub.imageFile)
          .filter((file): file is File => file !== undefined);

        createMutate({
          name: data.name.trim(),
          description: data.description?.trim() || "",
          image: categoryImage || undefined,
          subCategories: subCategoryData.length > 0 ? subCategoryData : undefined,
          subImages: subImages.length > 0 ? subImages : undefined,
        });
      }
    },
  });

  // Populate form when category data is loaded (edit mode)
  useEffect(() => {
    if (categoryData) {
      formik.setValues({
        name: categoryData.name || "",
        description: categoryData.description || "",
        isActive: categoryData.isActive ?? true,
      });
      if (categoryData.image) {
        setExistingImage(getImageUrl(categoryData.image));
      }
      if (categoryData.subCategories) {
        setExistingSubCategories(categoryData.subCategories);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryData]);

  // Image handlers
  const handleCategoryImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);
      setCategoryImagePreview(URL.createObjectURL(file));
      setExistingImage(null);
    }
  }, []);

  const removeCategoryImage = useCallback(() => {
    if (categoryImagePreview) {
      URL.revokeObjectURL(categoryImagePreview);
    }
    setCategoryImage(null);
    setCategoryImagePreview(null);
    setExistingImage(null);
  }, [categoryImagePreview]);

  // Create mode subcategory handlers
  const addNewSubCategory = useCallback(() => {
    setNewSubCategories((prev) => [...prev, { name: "", description: "" }]);
  }, []);

  const removeNewSubCategory = useCallback((index: number) => {
    setNewSubCategories((prev) => {
      const sub = prev[index];
      if (sub.imagePreview) {
        URL.revokeObjectURL(sub.imagePreview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const updateNewSubCategory = useCallback(
    (index: number, field: keyof SubCategoryFormValues, value: string) => {
      setNewSubCategories((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    []
  );

  const handleNewSubCategoryImageChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setNewSubCategories((prev) => {
          const updated = [...prev];
          if (updated[index].imagePreview) {
            URL.revokeObjectURL(updated[index].imagePreview!);
          }
          updated[index] = {
            ...updated[index],
            imageFile: file,
            imagePreview: URL.createObjectURL(file),
          };
          return updated;
        });
      }
    },
    []
  );

  const removeNewSubCategoryImage = useCallback((index: number) => {
    setNewSubCategories((prev) => {
      const updated = [...prev];
      if (updated[index].imagePreview) {
        URL.revokeObjectURL(updated[index].imagePreview!);
      }
      updated[index] = {
        ...updated[index],
        imageFile: undefined,
        imagePreview: undefined,
      };
      return updated;
    });
  }, []);

  // Edit mode subcategory handlers
  const handleNewSubImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (newSubImagePreview) {
          URL.revokeObjectURL(newSubImagePreview);
        }
        setNewSubImage(file);
        setNewSubImagePreview(URL.createObjectURL(file));
      }
    },
    [newSubImagePreview]
  );

  const removeNewSubImage = useCallback(() => {
    if (newSubImagePreview) {
      URL.revokeObjectURL(newSubImagePreview);
    }
    setNewSubImage(null);
    setNewSubImagePreview(null);
  }, [newSubImagePreview]);

  const handleAddSubCategoryToServer = useCallback(() => {
    if (!id || !newSubName.trim()) {
      toast.error("Please enter subcategory name");
      return;
    }
    addSubMutate({
      categoryId: id,
      data: {
        name: newSubName,
        description: newSubDescription || undefined,
      },
      image: newSubImage || undefined,
    });
  }, [id, newSubName, newSubDescription, newSubImage, addSubMutate]);

  const handleDeleteSubCategory = useCallback(
    (subCategoryId: string) => {
      if (!id) return;
      if (window.confirm("Are you sure you want to delete this subcategory?")) {
        deleteSubMutate({ categoryId: id, subCategoryId });
      }
    },
    [id, deleteSubMutate]
  );

  const isPending = isCreating || isUpdating;

  if (isEditMode && isLoadingCategory) {
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
            {isEditMode ? "Edit Category" : "Add New Category"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEditMode
              ? "Update the category details and manage subcategories."
              : "Fill in the details to create a new category with optional subcategories."}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-6">
            {/* Category Details */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Category Name */}
              <div>
                <Label>
                  Category Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Enter category name"
                  type="text"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  maxLength={50}
                />
                {formik.errors.name && formik.touched.name && (
                  <p className="text-error-500 text-sm mt-1">{formik.errors.name}</p>
                )}
              </div>

              {/* Active Status - only show in edit mode */}
              {isEditMode && (
                <div>
                  <Label>Status</Label>
                  <Select
                    name="isActive"
                    options={activeOptions}
                    placeholder="Select status"
                    value={formik.values.isActive ? "true" : "false"}
                    onChange={(value) => formik.setFieldValue("isActive", value === "true")}
                  />
                </div>
              )}

              {/* Category Image */}
              <div>
                <Label>Category Image</Label>
                <div className="flex items-center gap-4">
                  {categoryImagePreview || existingImage ? (
                    <div className="relative">
                      <img
                        src={categoryImagePreview || existingImage || ""}
                        alt="Category preview"
                        className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeCategoryImage}
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
                        onChange={handleCategoryImageChange}
                        className="hidden"
                      />
                      <Upload className="h-6 w-6 text-gray-400" />
                    </label>
                  )}
                </div>
              </div>

              {/* Description - Full Width */}
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <textarea
                  placeholder="Enter category description"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  maxLength={255}
                  rows={3}
                  className="h-auto w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 resize-none"
                />
                {formik.errors.description && formik.touched.description && (
                  <p className="text-error-500 text-sm mt-1">{formik.errors.description}</p>
                )}
              </div>
            </div>

            {/* Subcategories Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Subcategories</h3>
                  <p className="text-sm text-gray-500">
                    {isEditMode
                      ? "Manage subcategories for this category."
                      : "Add subcategories to organize your products better."}
                  </p>
                </div>
                {isEditMode ? (
                  !showAddSubForm && (
                    <button
                      type="button"
                      onClick={() => setShowAddSubForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Subcategory
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={addNewSubCategory}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Subcategory
                  </button>
                )}
              </div>

              {/* Edit Mode: Add Subcategory Form */}
              {isEditMode && showAddSubForm && (
                <div className="p-4 bg-brand-50 rounded-lg border border-brand-200 mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">New Subcategory</h4>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      {newSubImagePreview ? (
                        <div className="relative">
                          <img
                            src={newSubImagePreview}
                            alt="New subcategory"
                            className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={removeNewSubImage}
                            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-brand-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleNewSubImageChange}
                            className="hidden"
                          />
                          <Upload className="h-5 w-5 text-gray-400" />
                        </label>
                      )}
                    </div>
                    <div className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Input
                          placeholder="Subcategory name *"
                          type="text"
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          maxLength={50}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Description (optional)"
                          type="text"
                          value={newSubDescription}
                          onChange={(e) => setNewSubDescription(e.target.value)}
                          maxLength={255}
                        />
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddSubForm(false);
                          setNewSubName("");
                          setNewSubDescription("");
                          removeNewSubImage();
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleAddSubCategoryToServer}
                        disabled={isAddingSub || !newSubName.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAddingSub ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Mode: Existing Subcategories */}
              {isEditMode && (
                existingSubCategories.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 text-sm">No subcategories yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {existingSubCategories.map((sub) => (
                      <div
                        key={sub._id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="shrink-0">
                          {sub.image ? (
                            <img
                              src={getImageUrl(sub.image)}
                              alt={sub.name}
                              className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{sub.name}</p>
                          {sub.description && (
                            <p className="text-sm text-gray-500 truncate">{sub.description}</p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            sub.isActive !== false
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {sub.isActive !== false ? "Active" : "Inactive"}
                        </span>
                        <button
                          type="button"
                          onClick={() => sub._id && handleDeleteSubCategory(sub._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Create Mode: New Subcategories */}
              {!isEditMode && (
                newSubCategories.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 text-sm">No subcategories added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {newSubCategories.map((sub, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-4">
                          <div className="shrink-0">
                            {sub.imagePreview ? (
                              <div className="relative">
                                <img
                                  src={sub.imagePreview}
                                  alt={`Subcategory ${index + 1}`}
                                  className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeNewSubCategoryImage(index)}
                                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-400 transition-colors">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleNewSubCategoryImageChange(index, e)}
                                  className="hidden"
                                />
                                <Upload className="h-5 w-5 text-gray-400" />
                              </label>
                            )}
                          </div>
                          <div className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <Input
                                placeholder="Subcategory name"
                                type="text"
                                value={sub.name}
                                onChange={(e) => updateNewSubCategory(index, "name", e.target.value)}
                                maxLength={50}
                              />
                            </div>
                            <div>
                              <Input
                                placeholder="Description (optional)"
                                type="text"
                                value={sub.description || ""}
                                onChange={(e) => updateNewSubCategory(index, "description", e.target.value)}
                                maxLength={255}
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewSubCategory(index)}
                            className="shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/categories")}
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 transition rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                {isEditMode ? "← Back to Categories" : "Cancel"}
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
                  ? "Update Category"
                  : "Create Category"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryForm;
