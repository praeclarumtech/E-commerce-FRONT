import { object, string } from "yup";

export const brandSchema = object().shape({
  brandName: string()
    .min(2, "Brand name must be at least 2 characters")
    .max(100, "Brand name is too long")
    .required("Please enter brand name."),
  description: string().max(500, "Description is too long").optional(),
});
