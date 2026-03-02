import { boolean, object, string } from "yup";

export const serviceSchema = object().shape({
    key: string()
        .min(2, "Key must be at least 2 characters")
        .max(50, "Key must be at most 50 characters")
        .required("Please enter service key."),
    title: string()
        .min(2, "Title must be at least 2 characters")
        .max(100, "Title must be at most 100 characters")
        .required("Please enter service title."),
    subtitle: string()
        .min(2, "Subtitle must be at least 2 characters")
        .max(200, "Subtitle must be at most 200 characters")
        .required("Please enter subtitle."),
    icon: string()
        .min(2, "Icon must be at least 2 characters")
        .max(50, "Icon must be at most 50 characters")
        .required("Please enter icon key."),
    isActive: boolean().optional(),
});
