import React, {useEffect, useState} from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {useLogto} from "@logto/react";
import {useUserStore} from "../../store/user/UserStore.ts";
import useApp from "antd/es/app/useApp";
import HomePage from "../../pages/home/HomePage.tsx";
import {useNavigate} from "react-router";

const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({element}) => {
    const {isAuthenticated} = useLogto();
    const isSignedBackend = useUserStore(state => state.isSignedIn);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const {message} = useApp()
    const nav = useNavigate()
    useEffect(() => {
        const checkAuth = async () => {
            if (!isAuthenticated || !isSignedBackend) {
                message.info('请先登录');
                setIsAuthorized(false);
                nav('/')
            } else {
                setIsAuthorized(true);
            }
        };

        checkAuth();
    }, [isAuthenticated, isSignedBackend]);

    if (isAuthorized === null) {
        // Optionally, you could return a loader or spinner here while you're checking
        return <div>Loading...</div>;
    }

    return isAuthorized ? <>{element}</> : <HomePage/>;
};

export default ProtectedRoute;