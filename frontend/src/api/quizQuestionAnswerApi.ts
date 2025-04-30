import {fetchAPI} from "./base.ts";

export async function getTotalResponse(): Promise<number | null> {
    return await fetchAPI<number>(`/quizquestionanswer/gettotalresponse`,{});
}