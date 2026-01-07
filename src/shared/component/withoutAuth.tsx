import { ComponentType, FC } from "react";

import { Navigate } from "react-router";

import { ECOMMERCE_ACCESS_TOKEN } from "../constant";
import { getCookie } from "../utils/auth";

const withoutAuth = (Component: ComponentType): FC => {

    return function (props) {
        if (getCookie(ECOMMERCE_ACCESS_TOKEN)) {
            return <Navigate to={"/"} />;
        }
        return <Component {...props} />;
    };
};

export default withoutAuth;