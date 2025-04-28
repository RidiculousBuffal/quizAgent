// src/api/userApi.ts（自动补全接口）
import {fetchAPI} from "./base";

export interface UserType {
    userId: string;
    userName: string;
    userEmail: string;
    userAvatar: string;
}

export async function autocompleteUsers(keyword: string): Promise<UserType[] | null> {
    if (!keyword) return [];
    return await fetchAPI<UserType[]>(`/user/autocomplete?keyword=${encodeURIComponent(keyword)}`,{});
}