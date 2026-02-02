export type City ={
    _id: string,
    cityName: string,
    countryId: string,
    stateId: string,
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export type CityFormValu = {
    countryId: string,
    stateId: string,
    cityName: string,
}

export type UpdateCity = {
    countryId: string,
    stateId: string,
    cityName: string,
}

export type CityRequestData = CityFormValu;

export type cityResponseData = {
    data: City,
};

export type CityListResponse = {
    items: City[];
    page: number;
    totalPages: number;
    total: number;
};