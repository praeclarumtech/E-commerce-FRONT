import { object, string } from "yup";

export const StateSchema =object().shape({
    stateName: string()
        .min(2, 'State name must be at least 2 characters')
        .max(50, 'State name is too long!')
        .required('Please enter State name.'),
});