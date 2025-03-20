import { useHandleSignInCallback } from '@logto/react';
import {useNavigate} from "react-router";

const Callback = () => {
    const nav = useNavigate()
    const { isLoading } = useHandleSignInCallback(() => {
        nav('/home')
    });

    // When it's working in progress
    if (isLoading) {
        return <div>Redirecting...</div>;
    }

    return null;
};
export default Callback