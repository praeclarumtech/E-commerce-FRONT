export type Country = {
    _id: string;
    countryName: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export type CountryFormValu = {
    countryName: string
}

export type UpdateCountry = {
    countryName: string
}

export type CountryRequestData = CountryFormValu;

export type CountryResponseData = {
    data: Country,
};

export type CountryListResponse = {
    items: Country[];
    page: number;
    totalPages: number;
    total: number;
};