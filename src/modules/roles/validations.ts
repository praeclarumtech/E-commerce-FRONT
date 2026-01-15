import { object, string } from "yup";

export const roleSchema = object().shape({
    name: string()
        .min(2, 'Role name must be at least 2 characters')
        .max(50, 'Role name is too long!')
        .required('Please enter role name.'),
});
