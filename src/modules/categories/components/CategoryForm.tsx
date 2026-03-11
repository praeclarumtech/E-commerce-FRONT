import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { mdiPlus, mdiClose, mdiUpload, mdiTrashCan, mdiPencil } from "@mdi/js";

import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import CardBox from "../../_components/CardBox";
import FormField from "../../_components/FormField";
import Icon from "../../_components/Icon";
import { toast } from "../../_lib/toast";
import { getImageUrl } from "../../../shared/constant";
import {
  createCategory,
  getCategoryById,
  updateCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../api";
import { categorySchema, categoryWithSubsSchema } from "../validations";
import type { SubCategory, SubCategoryFormValues } from "../interface";

type SubCategoryWithImage = SubCategoryFormValues & {
  imageFile?: File;
  imagePreview?: string;
};

const activeOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const inputClass =
  "px-3 py-2 max-w-full border border-gray-700 rounded-sm w-full dark:placeholder-gray-400 focus:ring-3 focus:ring-blue-600 focus:border-blue-600 focus:outline-hidden h-12 bg-white dark:bg-slate-800 dark:border-slate-600";
const selectClass =
  "px-3 py-2 max-w-full border border-gray-700 rounded-sm w-full focus:ring-3 focus:ring-blue-600 focus:border-blue-600 focus:outline-hidden h-12 bg-white dark:bg-slate-800 dark:border-slate-600";

export default function CategoryForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [newSubCategories, setNewSubCategories] = useState<SubCategoryWithImage[]>([]);
  const [existingSubCategories, setExistingSubCategories] = useState<SubCategory[]>([]);
  const [showAddSubForm, setShowAddSubForm] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubDescription, setNewSubDescription] = useState("");
  const [newSubImage, setNewSubImage] = useState<File | null>(null);
  const [newSubImagePreview, setNewSubImagePreview] = useState<string | null>(null);

  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editSubName, setEditSubName] = useState("");
  const [editSubDescription, setEditSubDescription] = useState("");
  const [editSubIsActive, setEditSubIsActive] = useState(true);
  const [editSubImage, setEditSubImage] = useState<File | null>(null);
  const [editSubImagePreview, setEditSubImagePreview] = useState<string | null>(null);
  const [editSubExistingImage, setEditSubExistingImage] = useState<string | null>(null);

  const { data: categoryData, isLoading: isLoadingCategory, isError: isCategoryError } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id!),
    enabled: isEditMode,
    select: (response) => response.data.data,
  });

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

  const { isPending: isUpdating, mutate: updateMutate } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/categories");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to update category");
    },
  });

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

  const { isPending: isUpdatingSub, mutate: updateSubMutate } = useMutation({
    mutationFn: updateSubCategory,
    onSuccess: () => {
      toast.success("Subcategory updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      cancelEditSubCategory();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || "Failed to update subcategory");
    },
  });

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

  const handleCategoryImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);
      setCategoryImagePreview(URL.createObjectURL(file));
      setExistingImage(null);
      setImageError(null);
    }
  }, []);

  const removeCategoryImage = useCallback(() => {
    if (categoryImagePreview) URL.revokeObjectURL(categoryImagePreview);
    setCategoryImage(null);
    setCategoryImagePreview(null);
    setExistingImage(null);
    setImageError(null);
  }, [categoryImagePreview]);

  const addNewSubCategory = useCallback(() => {
    setNewSubCategories((prev) => [...prev, { name: "", description: "" }]);
  }, []);

  const removeNewSubCategory = useCallback((index: number) => {
    setNewSubCategories((prev) => {
      const sub = prev[index];
      if (sub.imagePreview) URL.revokeObjectURL(sub.imagePreview);
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
          if (updated[index].imagePreview) URL.revokeObjectURL(updated[index].imagePreview!);
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
      if (updated[index].imagePreview) URL.revokeObjectURL(updated[index].imagePreview!);
      updated[index] = { ...updated[index], imageFile: undefined, imagePreview: undefined };
      return updated;
    });
  }, []);

  const handleNewSubImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (newSubImagePreview) URL.revokeObjectURL(newSubImagePreview);
        setNewSubImage(file);
        setNewSubImagePreview(URL.createObjectURL(file));
      }
    },
    [newSubImagePreview]
  );

  const removeNewSubImage = useCallback(() => {
    if (newSubImagePreview) URL.revokeObjectURL(newSubImagePreview);
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
      data: { name: newSubName, description: newSubDescription || undefined },
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

  const startEditSubCategory = useCallback((sub: SubCategory) => {
    setEditingSubId(sub._id || null);
    setEditSubName(sub.name);
    setEditSubDescription(sub.description || "");
    setEditSubIsActive(sub.isActive !== false);
    setEditSubImage(null);
    setEditSubImagePreview(null);
    setEditSubExistingImage(sub.image ? getImageUrl(sub.image) : null);
    setShowAddSubForm(false);
  }, []);

  const cancelEditSubCategory = useCallback(() => {
    setEditingSubId(null);
    setEditSubName("");
    setEditSubDescription("");
    setEditSubIsActive(true);
    if (editSubImagePreview) URL.revokeObjectURL(editSubImagePreview);
    setEditSubImage(null);
    setEditSubImagePreview(null);
    setEditSubExistingImage(null);
  }, [editSubImagePreview]);

  const handleEditSubImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (editSubImagePreview) URL.revokeObjectURL(editSubImagePreview);
        setEditSubImage(file);
        setEditSubImagePreview(URL.createObjectURL(file));
        setEditSubExistingImage(null);
      }
    },
    [editSubImagePreview]
  );

  const removeEditSubImage = useCallback(() => {
    if (editSubImagePreview) URL.revokeObjectURL(editSubImagePreview);
    setEditSubImage(null);
    setEditSubImagePreview(null);
    setEditSubExistingImage(null);
  }, [editSubImagePreview]);

  const handleUpdateSubCategory = useCallback(() => {
    if (!id || !editingSubId || !editSubName.trim()) {
      toast.error("Please enter subcategory name");
      return;
    }
    updateSubMutate({
      categoryId: id,
      subCategoryId: editingSubId,
      data: {
        name: editSubName,
        description: editSubDescription || undefined,
        isActive: editSubIsActive,
      },
      image: editSubImage || undefined,
    });
  }, [id, editingSubId, editSubName, editSubDescription, editSubIsActive, editSubImage, updateSubMutate]);

  useEffect(() => {
    if (categoryData) {
      if (categoryData.image) setExistingImage(getImageUrl(categoryData.image));
      if (categoryData.subCategories) setExistingSubCategories(categoryData.subCategories);
    }
  }, [categoryData]);

  const isPending = isCreating || isUpdating;

  if (isEditMode && isLoadingCategory) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
      </div>
    );
  }

  if (isEditMode && isCategoryError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-gray-600 dark:text-slate-400">Category not found or you don&apos;t have access.</p>
        <Button
          type="button"
          label="← Back to Categories"
          color="whiteDark"
          outline
          onClick={() => navigate("/categories")}
        />
      </div>
    );
  }

  const initialValues = {
    name: categoryData?.name ?? "",
    description: categoryData?.description ?? "",
    isActive: categoryData?.isActive ?? true,
  };

  return (
    <div className="h-full overflow-y-auto">
      <CardBox
        footer={
          <Buttons className="!justify-between">
            <Button
              type="button"
              label={isEditMode ? "← Back to Categories" : "Cancel"}
              color="whiteDark"
              outline
              onClick={() => navigate("/categories")}
              isGrouped
            />
            <Buttons className="!justify-end">
              <Button
                type="submit"
                form="category-form"
                label={
                  isPending
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                    ? "Update Category"
                    : "Create Category"
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
          {isEditMode ? "Edit Category" : "Add New Category"}
        </h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-slate-400">
          {isEditMode
            ? "Update the category details and manage subcategories."
            : "Fill in the details to create a new category with optional subcategories."}
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={isEditMode ? categorySchema : categoryWithSubsSchema}
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(data) => {
            const hasImage = !!(categoryImage || existingImage);
            if (!hasImage) {
              setImageError("Category image is required.");
              return;
            }
            setImageError(null);
            if (isEditMode) {
              updateMutate({
                categoryId: id!,
                data: {
                  name: data.name,
                  description: data.description,
                  isActive: data.isActive,
                  image: categoryImage || undefined,
                },
              });
            } else {
              const validSubs = newSubCategories.filter((s) => s.name.trim() !== "");
              const subCategoryData = validSubs.map((s) => ({
                name: s.name.trim(),
                description: s.description?.trim() || "",
              }));
              const subImages = validSubs
                .map((s) => s.imageFile)
                .filter((f): f is File => f !== undefined);
              createMutate({
                name: data.name.trim(),
                description: data.description?.trim() || "",
                image: categoryImage || undefined,
                subCategories: subCategoryData.length > 0 ? subCategoryData : undefined,
                subImages: subImages.length > 0 ? subImages : undefined,
              });
            }
          }}
        >
          {({ setFieldValue, values, errors }) => (
            <Form id="category-form">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField label="Category Name *" labelFor="name">
                    {({ className }) => (
                      <>
                        <Field
                          name="name"
                          id="name"
                          placeholder="Enter category name"
                          maxLength={50}
                          className={className}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                      </>
                    )}
                  </FormField>

                  {isEditMode && (
                    <FormField label="Status" labelFor="isActive">
                      {({ className }) => (
                        <select
                          id="isActive"
                          className={className}
                          value={values.isActive ? "true" : "false"}
                          onChange={(e) => setFieldValue("isActive", e.target.value === "true")}
                        >
                          {activeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </FormField>
                  )}

                  <div className="mb-6 last:mb-0">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Category Image <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      {categoryImagePreview || existingImage ? (
                        <div className="relative">
                          <img
                            src={categoryImagePreview || existingImage || ""}
                            alt="Category preview"
                            className="h-20 w-20 rounded-lg border border-gray-200 object-cover dark:border-slate-600"
                          />
                          <button
                            type="button"
                            onClick={removeCategoryImage}
                            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                          >
                            <Icon path={mdiClose} size={12} />
                          </button>
                        </div>
                      ) : (
                        <label
                          className={`flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors dark:hover:border-blue-500 ${
                            imageError
                              ? "border-red-500 hover:border-red-600 dark:border-red-500"
                              : "border-gray-700 hover:border-blue-600 dark:border-slate-600"
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCategoryImageChange}
                            className="hidden"
                          />
                          <Icon path={mdiUpload} size={24} className="text-gray-500 dark:text-slate-400" />
                        </label>
                      )}
                    </div>
                    {imageError && (
                      <p className="mt-1 text-sm text-red-500">{imageError}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <FormField label="Description" labelFor="description" hasTextareaHeight>
                      {({ className }) => (
                        <>
                          <Field
                            as="textarea"
                            name="description"
                            id="description"
                            placeholder="Enter category description"
                            maxLength={255}
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
                </div>

                {/* Subcategories */}
                <div className="border-t border-gray-200 pt-6 dark:border-slate-700">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100">
                        Subcategories
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {isEditMode
                          ? "Manage subcategories for this category."
                          : "Add subcategories to organize your products better."}
                      </p>
                    </div>
                    {isEditMode ? (
                      !showAddSubForm && (
                        <Button
                          type="button"
                          label="Add Subcategory"
                          icon={mdiPlus}
                          color="info"
                          small
                          onClick={() => setShowAddSubForm(true)}
                        />
                      )
                    ) : (
                      <Button
                        type="button"
                        label="Add Subcategory"
                        icon={mdiPlus}
                        color="info"
                        small
                        onClick={addNewSubCategory}
                      />
                    )}
                  </div>

                  {/* Edit: Add new sub form */}
                  {isEditMode && showAddSubForm && (
                    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
                      <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-slate-100">
                        New Subcategory
                      </h4>
                      <div className="flex flex-wrap items-start gap-4">
                        <div className="shrink-0">
                          {newSubImagePreview ? (
                            <div className="relative">
                              <img
                                src={newSubImagePreview}
                                alt="New subcategory"
                                className="h-16 w-16 rounded-lg border border-gray-200 object-cover dark:border-slate-600"
                              />
                              <button
                                type="button"
                                onClick={removeNewSubImage}
                                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                              >
                                <Icon path={mdiClose} size={12} />
                              </button>
                            </div>
                          ) : (
                            <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-white transition-colors hover:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-500">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleNewSubImageChange}
                                className="hidden"
                              />
                              <Icon path={mdiUpload} size={20} className="text-gray-500 dark:text-slate-400" />
                            </label>
                          )}
                        </div>
                        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                          <input
                            placeholder="Subcategory name *"
                            type="text"
                            value={newSubName}
                            onChange={(e) => setNewSubName(e.target.value)}
                            maxLength={50}
                            className={inputClass}
                          />
                          <input
                            placeholder="Description (optional)"
                            type="text"
                            value={newSubDescription}
                            onChange={(e) => setNewSubDescription(e.target.value)}
                            maxLength={255}
                            className={inputClass}
                          />
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            type="button"
                            color="whiteDark"
                            icon={mdiClose}
                            small
                            onClick={() => {
                              setShowAddSubForm(false);
                              setNewSubName("");
                              setNewSubDescription("");
                              removeNewSubImage();
                            }}
                          />
                          <Button
                            type="button"
                            label={isAddingSub ? "Adding..." : "Add"}
                            color="info"
                            disabled={isAddingSub || !newSubName.trim()}
                            small
                            onClick={handleAddSubCategoryToServer}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit: existing subcategories */}
                  {isEditMode &&
                    (existingSubCategories.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center dark:border-slate-600">
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          No subcategories yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {existingSubCategories.map((sub) =>
                          editingSubId === sub._id ? (
                            <div
                              key={sub._id}
                              className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-slate-600 dark:bg-slate-800/50"
                            >
                              <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-slate-100">
                                Edit Subcategory
                              </h4>
                              <div className="flex flex-wrap items-start gap-4">
                                <div className="shrink-0">
                                  {editSubImagePreview || editSubExistingImage ? (
                                    <div className="relative">
                                      <img
                                        src={editSubImagePreview || editSubExistingImage || ""}
                                        alt="Subcategory"
                                        className="h-16 w-16 rounded-lg border border-gray-200 object-cover dark:border-slate-600"
                                      />
                                      <button
                                        type="button"
                                        onClick={removeEditSubImage}
                                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                      >
                                        <Icon path={mdiClose} size={12} />
                                      </button>
                                    </div>
                                  ) : (
                                    <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-white transition-colors hover:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-500">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleEditSubImageChange}
                                        className="hidden"
                                      />
                                      <Icon path={mdiUpload} size={20} className="text-gray-500 dark:text-slate-400" />
                                    </label>
                                  )}
                                </div>
                                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                                  <input
                                    placeholder="Subcategory name *"
                                    type="text"
                                    value={editSubName}
                                    onChange={(e) => setEditSubName(e.target.value)}
                                    maxLength={50}
                                    className={inputClass}
                                  />
                                  <input
                                    placeholder="Description (optional)"
                                    type="text"
                                    value={editSubDescription}
                                    onChange={(e) => setEditSubDescription(e.target.value)}
                                    maxLength={255}
                                    className={inputClass}
                                  />
                                  <select
                                    className={selectClass}
                                    value={editSubIsActive ? "true" : "false"}
                                    onChange={(e) => setEditSubIsActive(e.target.value === "true")}
                                  >
                                    {activeOptions.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  <Button
                                    type="button"
                                    color="whiteDark"
                                    icon={mdiClose}
                                    small
                                    onClick={cancelEditSubCategory}
                                  />
                                  <Button
                                    type="button"
                                    label={isUpdatingSub ? "Saving..." : "Save"}
                                    color="info"
                                    disabled={isUpdatingSub || !editSubName.trim()}
                                    small
                                    onClick={handleUpdateSubCategory}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              key={sub._id}
                              className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
                            >
                              <div className="shrink-0">
                                {sub.image ? (
                                  <img
                                    src={getImageUrl(sub.image)}
                                    alt={sub.name}
                                    className="h-12 w-12 rounded-lg border border-gray-200 object-cover dark:border-slate-600"
                                  />
                                ) : (
                                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-400 dark:bg-slate-700 dark:text-slate-500">
                                    No img
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 dark:text-slate-100">
                                  {sub.name}
                                </p>
                                {sub.description && (
                                  <p className="truncate text-sm text-gray-500 dark:text-slate-400">
                                    {sub.description}
                                  </p>
                                )}
                              </div>
                              <span
                                className={`rounded-full px-2 py-1 text-xs ${
                                  sub.isActive !== false
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                              >
                                {sub.isActive !== false ? "Active" : "Inactive"}
                              </span>
                              <Buttons noWrap>
                                <Button
                                  type="button"
                                  color="info"
                                  icon={mdiPencil}
                                  small
                                  isGrouped
                                  onClick={() => startEditSubCategory(sub)}
                                />
                                <Button
                                  type="button"
                                  color="danger"
                                  icon={mdiTrashCan}
                                  small
                                  isGrouped
                                  onClick={() => sub._id && handleDeleteSubCategory(sub._id)}
                                />
                              </Buttons>
                            </div>
                          )
                        )}
                      </div>
                    ))}

                  {/* Create: new subcategories */}
                  {!isEditMode &&
                    (newSubCategories.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center dark:border-slate-600">
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          No subcategories added yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {newSubCategories.map((sub, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
                          >
                            <div className="flex flex-wrap items-start gap-4">
                              <div className="shrink-0">
                                {sub.imagePreview ? (
                                  <div className="relative">
                                    <img
                                      src={sub.imagePreview}
                                      alt={`Subcategory ${index + 1}`}
                                      className="h-16 w-16 rounded-lg border border-gray-200 object-cover dark:border-slate-600"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeNewSubCategoryImage(index)}
                                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                    >
                                      <Icon path={mdiClose} size={12} />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-700 transition-colors hover:border-blue-600 dark:border-slate-600 dark:hover:border-blue-500">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleNewSubCategoryImageChange(index, e)}
                                      className="hidden"
                                    />
                                    <Icon path={mdiUpload} size={20} className="text-gray-500 dark:text-slate-400" />
                                  </label>
                                )}
                              </div>
                              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                                <input
                                  placeholder="Subcategory name"
                                  type="text"
                                  value={sub.name}
                                  onChange={(e) => updateNewSubCategory(index, "name", e.target.value)}
                                  maxLength={50}
                                  className={inputClass}
                                />
                                <input
                                  placeholder="Description (optional)"
                                  type="text"
                                  value={sub.description || ""}
                                  onChange={(e) =>
                                    updateNewSubCategory(index, "description", e.target.value)
                                  }
                                  maxLength={255}
                                  className={inputClass}
                                />
                              </div>
                              <Button
                                type="button"
                                color="danger"
                                icon={mdiTrashCan}
                                small
                                onClick={() => removeNewSubCategory(index)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </CardBox>
    </div>
  );
}
