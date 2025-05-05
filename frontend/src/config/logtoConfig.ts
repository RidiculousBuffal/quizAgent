import {LogtoConfig} from "@logto/react";
import {env} from '../env.ts'

export const logtoConfig: LogtoConfig = {
    endpoint: env.VITE_APP_LOGTO_ENDPOINT,
    appId: env.VITE_APP_LOGTO_APPID,
    resources: [env.VITE_APP_API_URL]
}
