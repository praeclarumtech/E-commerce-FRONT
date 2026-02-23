import { object, string } from "yup";

export const serviceSchema = object().shape({
    name: string()
        .min(2, "Service name must be at least 2 characters")
        .max(200, "Service name is too long")
        .required("Please enter service name."),
});
