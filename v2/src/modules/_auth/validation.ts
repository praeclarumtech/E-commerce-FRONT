import { object, string, ref } from "yup";

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
        .matches(
            /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
            'Please enter 10 digit phone number.')
        .length(10, 'Phone number must be 10 digits')
        .required('Phone number is required.'),
    role: string()
        .required('Role is required.'),
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
        .min(6, "Password must be at least 6 characters")
        .required("Password is required."),
    confirmPassword: string()
        .min(6, "Password must be at least 6 characters")
        .required("Confirm password is required.")
        .oneOf([ref("password")], "Passwords must match"),
});

const verifyMail = object().shape({
    email: string().email('Invalid email').required('Please enter you email.'),
});

const verifyOTPSchema = object().shape({
    email: string().email("Invalid email").required("Please enter your email."),
    otp: string()
        .length(6, "OTP must be 6 digits")
        .matches(/^\d{6}$/, "OTP must be 6 digits")
        .required("Please enter the OTP."),
});

const resetPasswordWithOTPSchema = verifyOTPSchema.concat(
    object().shape({
        newPassword: string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required."),
        confirmPassword: string()
            .required("Confirm password is required.")
            .oneOf([ref("newPassword")], "Passwords must match"),
    })
);

export {
    signinSchema,
    signupSchema,
    resetPasswordSchema,
    forgotPasswordSchema,
    verifyMail,
    verifyOTPSchema,
    resetPasswordWithOTPSchema,
};