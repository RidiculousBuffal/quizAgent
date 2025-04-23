import React, { useEffect, useState } from "react";

import { useLogto } from "@logto/react";
import { useUserStore } from "../../store/user/UserStore.ts";
import useApp from "antd/es/app/useApp";
import HomePage from "../../pages/home/HomePage.tsx";
import { useNavigate } from "react-router";

const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
    const { isAuthenticated, getAccessToken } = useLogto();
    const isSignedBackend = useUserStore(state => state.isSignedIn);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const { message } = useApp()
    const nav = useNavigate()
    useEffect(() => {
        const checkAuth = async () => {
            const token = await getAccessToken();
            if (!token || !isSignedBackend) {
                message.info('请先登录');
                setIsAuthorized(false);
                nav('/')
            } else {
                setIsAuthorized(true);
            }
        };

        checkAuth();
    }, [getAccessToken, isAuthenticated, isSignedBackend, message, nav]);

    if (isAuthorized === null) {
        // Optionally, you could return a loader or spinner here while you're checking
        return <div>Loading...</div>;
    }

    return isAuthorized ? <>{element}</> : <HomePage />;
};

export default ProtectedRoute;