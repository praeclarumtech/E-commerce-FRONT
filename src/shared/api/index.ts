import axios from "axios";

import { getCookie, removeCookie } from "../utils/auth";
import { ECOMMERCE_ACCESS_TOKEN } from "../constant";

const api = axios.create({
    baseURL: `${import.meta.env.ECOMMERCE_API_URL}`,
});

api.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${getCookie(ECOMMERCE_ACCESS_TOKEN)}`
    return config;
}, function (error) {
    return Promise.reject(error);
},
);

api.interceptors.response.use(function (response) {
    return response;
}, function onRejected(error) {
    if (error?.response?.data?.statusCode === 401) {
        removeCookie(ECOMMERCE_ACCESS_TOKEN);
        window.location.replace('/signin')
    }
    return Promise.reject(error);
});



export default api