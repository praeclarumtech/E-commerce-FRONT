import { object, string } from "yup";

export const offerSchema = object().shape({
    name: string()
        .min(2, "Offer name must be at least 2 characters")
        .max(200, "Offer name is too long")
        .required("Please enter offer name."),
});
