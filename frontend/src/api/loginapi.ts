import {fetchAPI} from "./base.ts";

export function doLogin(accessToken: string): Promise<string | null> {
    return fetchAPI(`/login?token=${accessToken}`)
}