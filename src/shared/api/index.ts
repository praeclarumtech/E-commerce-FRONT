import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.ECOMMERCE_API_URL}`,
});

api.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
},
);

api.interceptors.response.use(function onFulfilled(response) {
    return response;
}, function onRejected(error) {
    return Promise.reject(error);
});



export default api