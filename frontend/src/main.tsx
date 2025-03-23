import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import MyApp from './MyApp.tsx'
import {logtoConfig} from './config/logtoConfig.ts'
import {LogtoProvider} from "@logto/react";
import {BrowserRouter} from "react-router";
import {App} from "antd";
import Main from "./lib/Questions/demo/checkBox-radioTest/Main.tsx";

createRoot(document.getElementById('root')!).render(
    <App>
        {/*<MyApp></MyApp>*/}
        <Main></Main>
    </App>
)
