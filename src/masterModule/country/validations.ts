import { object, string } from "yup";

export const countrySchema =object().shape({
    countryName: string()
        .min(2, 'Country name must be at least 2 characters')
        .max(50, 'Country name is too long!')
        .required('Please enter country name.'),
});