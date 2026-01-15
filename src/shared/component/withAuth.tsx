import { ComponentType, FC } from "react";

import { Navigate } from "react-router-dom";

import { ECOMMERCE_ACCESS_TOKEN } from "../constant";
import { getCookie } from "../utils/auth";

const withAuth = (Component: ComponentType): FC => {
    return function (props) {
        if (!getCookie(ECOMMERCE_ACCESS_TOKEN)) {
            return <Navigate to={"/signin"} />;
        }
        return <Component {...props} />;
    };
};

export default withAuth;