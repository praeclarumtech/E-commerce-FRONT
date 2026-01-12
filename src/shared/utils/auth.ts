import Cookies from 'js-cookie';

const getCookie = (key: string) => {
    return Cookies.get(key)
}

const setCookie = (key: string, value: any) => {
    Cookies.set(key, value)
}

const removeCookie = (key: string) => {
    Cookies.remove(key)
}

export { getCookie, setCookie, removeCookie }