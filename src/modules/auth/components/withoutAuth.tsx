import { Navigate } from "react-router";
import { ComponentType, FC } from "react";

const withoutAuth = (Component: ComponentType): FC => {
    const token = localStorage.getItem("token");
    return function (props) {
        if (token) {
            return <Navigate to={"/"} />;
        }
        return <Component {...props} />;
    };
};

export default withoutAuth;