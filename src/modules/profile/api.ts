import api from "../../shared/api";
import { ProfileResponseData } from "./type";

export function getProfile() {
    return api.get<ProfileResponseData>('/users/profile');
}