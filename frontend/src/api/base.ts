import message from '../components/globalMessage/index.ts'
import {useUserStore} from "../store/user/UserStore.ts";

export const BASE_URL = import.meta.env.VITE_APP_API_URL

export interface Result<T> {
    code: number;
    msg: string;
    data: T;
}

/**
 * 通用 Fetch 方法
 */
export const fetchAPI = async <T>(url: string, options?: RequestInit): Promise<T | null> => {
    if (!url.includes('/login')) {
        //非登录接口自动加上请求头
        if (options) {
            const satoken = useUserStore.getState().saToken ?? '';
            options.headers = {
                'satoken': `${satoken}`,
                'Content-Type': 'application/json',
                ...options.headers,
            }
        }
    }
    const response = await fetch(`${BASE_URL}${url}`, options);

    if (!response.ok) {
        message.error('网络错误')
        throw new Error("网络错误")
    }
    const result: Result<T> = await response.json();
    if (result.code != 0) {
        message.error(result.msg);
        throw new Error(result.msg)
    } else {
        return result.data;
    }
};