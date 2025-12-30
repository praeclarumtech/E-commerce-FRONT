import { Navigate } from "react-router";
import { ComponentType, FC } from "react";

const withAuth = (Component: ComponentType): FC => {
    const token = localStorage.getItem("token");
    return function (props) {
        if (!token) {
            return <Navigate to={"/signin"} />;
        }
        return <Component {...props} />;
    };
};

export default withAuth;