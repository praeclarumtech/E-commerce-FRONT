export type AddUserFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
};

export type AddUserRequestData = AddUserFormValues & {
    role: string;
};

export type AddUserResponseData = {
    data: {
        userId: string;
    };
};
