import { object, string } from "yup";

const signinSchema = object().shape({
    email: string().email('Invalid email').required('Please enter you Email'),
    password: string()
        .min(6)
        .required('Password is required'),
});

const signupSchema =object().shape({
        fname:string()
            .min(2)
            .max(50, 'Too Long!')
            .required('please enter you First Name'),
        lname:string()
            .min(2)
            .max(50, 'Too Long!')
            .required('please enter you Last Name'),
        email:string().email('Invalid email').required('please enter you Email'),
        password:string()
            .min(6)
            .required('Password is required'),
    });

export { signinSchema, signupSchema }
