export type Country = {
    _id: string;
    name?: string;
    [key: string]: unknown;
};

export type State = {
    _id: string;
    name?: string;
    countryId?: string;
    [key: string]: unknown;
};

export type City = {
    _id: string;
    name?: string;
    stateId?: string;
    [key: string]: unknown;
};
