import {LogtoConfig} from "@logto/react";
export const logtoConfig:LogtoConfig={
    endpoint:import.meta.env.VITE_APP_LOGTO_ENDPOINT,
    appId:import.meta.env.VITE_APP_LOGTO_APPID,
    resources:[import.meta.env.VITE_APP_API_URL]
}
