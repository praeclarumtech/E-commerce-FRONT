import { object, string, number, boolean } from "yup";
import { ENUM_PRODUCT_STATUS } from "./type";

export const productSchema = object().shape({
    categoryId: string()
        .required('Please select a category.'),
    subCategoryId: string()
        .required('Please select a category.'),
    name: string()
        .min(2, 'Product name must be at least 2 characters')
        .max(20, 'Product name cannot exceed 20 characters')
        .required('Please enter product name.'),
    description: string()
        .max(255, 'Description cannot exceed 255 characters')
        .optional(),
    price: number()
        .min(0, 'Price must be a positive number')
        .required('Please enter the price.'),
    isActive: boolean()
        .optional(),
    status: string()
        .oneOf(Object.values(ENUM_PRODUCT_STATUS), 'Please select a valid status')
        .optional(),
});
