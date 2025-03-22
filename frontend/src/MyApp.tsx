import { Navigate, Route, Routes } from "react-router";
import Callback from "./pages/home/callback.tsx";

import Dashboard from "./pages/home/DashBoard.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import ProtectedRoute from "./components/auth/protectedRoute.tsx";
import { DebugFloater } from "./components/debug/debugButton.tsx";
import '../index.css'

// Protected route component


function MyApp() {
    return <>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/callback" element={<Callback />} />
            <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <DebugFloater></DebugFloater>
    </>
}

export default MyApp
