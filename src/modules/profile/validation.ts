import { object, string } from "yup";

const profileSchema = object().shape({
    firstName: string()
        .min(2)
        .max(50, 'Too Long!')
        .required('First name should not be empty.'),
    lastName: string()
        .min(2)
        .max(50, 'Too Long!')
        .required('Last name should not be empty.'),
    email: string()
        .email('Invalid email')
        .required('Please enter you email.'),
    phone: string()
        .matches(
      /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      'Please enter valid phone number.')
        .required('Phone number is required.'),
});

export default profileSchema;