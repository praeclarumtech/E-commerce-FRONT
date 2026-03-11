import { object, string, array } from "yup";

export const subCategorySchema = object().shape({
  name: string()
    .min(2, "Subcategory name must be at least 2 characters")
    .max(50, "Subcategory name cannot exceed 50 characters")
    .required("Please enter subcategory name."),
  description: string().max(255, "Description cannot exceed 255 characters").optional(),
});

export const categorySchema = object().shape({
  name: string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name cannot exceed 50 characters")
    .required("Please enter category name."),
  description: string()
    .max(255, "Description cannot exceed 255 characters")
    .optional(),
});

export const categoryWithSubsSchema = object().shape({
  name: string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name cannot exceed 50 characters")
    .required("Please enter category name."),
  description: string()
    .max(255, "Description cannot exceed 255 characters")
    .optional(),
  subCategories: array().of(subCategorySchema).optional(),
});
