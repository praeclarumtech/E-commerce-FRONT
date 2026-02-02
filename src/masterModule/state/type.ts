export type State = {
    _id: string;
    countryId: string,
    stateName: string,
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export type StateFormValu = {
    countryId: string,
    stateName: string,
}

export type UpdateState = {
    countryId: string,
    stateName: string,
}

export type StateRequestData = StateFormValu;

export type stateResponseData = {
    data: State,
};

export type StateListResponse = {
    items: State[];
    page: number;
    totalPages: number;
    total: number;
};