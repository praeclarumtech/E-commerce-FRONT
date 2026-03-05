import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.ECOMMERCE_API_URL}`,
});

api.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('__token')}`
    return config;
}, function (error) {
    return Promise.reject(error);
},
);

api.interceptors.response.use(function (response) {
    return response;
}, function onRejected(error) {
    if (error?.response?.data?.statusCode === 401) {
        localStorage.removeItem('__token');
        window.location.replace('/e-comm/v2/login')
    }
    return Promise.reject(error);
});



export default api