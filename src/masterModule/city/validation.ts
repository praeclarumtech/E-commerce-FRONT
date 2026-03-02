import { object, string } from "yup";

export const CitySchema =object().shape({
    cityName: string()
        .min(2, 'City name must be at least 2 characters')
        .max(50, 'City name is too long!')
        .required('Please enter City name.'),
});