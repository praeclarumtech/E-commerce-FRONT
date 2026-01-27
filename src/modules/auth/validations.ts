import { object, string } from "yup";

const signinSchema = object().shape({
    email: string().email('Invalid email').required('Please enter you email.'),
    password: string()
        .min(6)
        .required('Password is required.'),
});

const signupSchema = object().shape({
    firstName: string()
        .min(2)
        .max(50, 'Too Long!')
        .required('Please enter you first name.'),
    lastName: string()
        .min(2)
        .max(50, 'Too Long!')
        .required('Please enter you last name.'),
    email: string().email('Invalid email').required('Please enter you email.'),
    password: string()
        .min(6)
        .required('Password is required.'),
    phone: string()
        .min(10)
        .max(15)
        .required('Phone number is required.'),
    role: string()
        .required('Please select a role.'),
});

const resetPasswordSchema = object().shape({
    email: string().email('Invalid email').required('Please enter you email.'),
    currentPassword: string()
        .min(6)
        .required('Password is required.'),
    newPassword: string()
        .min(6)
        .required('Password is required.'),
    confirmPassword: string()
        .min(6)
        .required('Password is required.'),
});

const forgotPasswordSchema = object().shape({
    password: string()
        .min(6)
        .required('Password is required.'),
    confirmPassword: string()
        .min(6)
        .required('Password is required.'),
});

const verifyMail = object().shape({
    email: string().email('Invalid email').required('Please enter you email.'),
});


export {
    signinSchema,
    signupSchema,
    resetPasswordSchema,
    forgotPasswordSchema,
    verifyMail,
}