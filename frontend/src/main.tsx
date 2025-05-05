
import {createRoot} from 'react-dom/client'
import MyApp from './MyApp.tsx'
import {logtoConfig} from './config/logtoConfig.ts'
import {LogtoProvider} from "@logto/react";
import {BrowserRouter} from "react-router";
import {App} from "antd";

createRoot(document.getElementById('root')!).render(
    <LogtoProvider config={logtoConfig}>
        <BrowserRouter>
            <App>
                <MyApp></MyApp>
            </App>
        </BrowserRouter>
    </LogtoProvider>
)
