import { object, string } from "yup";

const baseUserSchema = {
    firstName: string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name is too long!')
        .required('Please enter first name.'),
    lastName: string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name is too long!')
        .required('Please enter last name.'),
    email: string()
        .email('Invalid email')
        .required('Please enter email.'),
    phone: string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number is too long')
        .required('Phone number is required.'),
    gender: string()
        .oneOf(['male', 'female', 'other'], 'Please select a valid gender')
        .required('Please select gender.'),
    role: string()
        .required('Please select a role.'),
};

export const addUserSchema = object().shape({
    ...baseUserSchema,
    password: string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required.'),
});

export const editUserSchema = object().shape({
    ...baseUserSchema,
});
