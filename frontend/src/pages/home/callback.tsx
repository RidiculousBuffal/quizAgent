import {useHandleSignInCallback, useLogto} from '@logto/react';
import {useNavigate} from "react-router";
import {Spin} from 'antd';
import {useUserStore} from '../../store/user/UserStore.ts';
import {BASE_URL} from "../../api/base.ts";
import {doLogin} from "../../api/loginapi.ts";
import {getUserInfo} from "../../api/userapi.ts";


const Callback = () => {
    const nav = useNavigate();
    const {getAccessTokenClaims, getAccessToken} = useLogto();
    const setUserData = useUserStore(state => state.setUserData);
    const login = useUserStore(state => state.login)
    const {isLoading} = useHandleSignInCallback(async () => {
        try {
            const claims = await getAccessTokenClaims(BASE_URL);
            if (claims) {
                const userId = claims.sub;
                const token = await getAccessToken(BASE_URL)
                const saToken = await doLogin(token!)
                if (saToken) {
                    login(saToken)
                    // Store user data in Zustand
                    const userInfo = await getUserInfo(userId?.toString() as string)
                    setUserData(userInfo);
                    nav('/dashboard');
                } else {
                    nav('/')
                }

            }
        } catch (error) {
            console.error('Error processing login:', error);
            nav('/'); // Redirect to homepage on error
        }
    });

    // Loading indicator
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column'
            }}>
                <Spin size="large"/>
                <div style={{marginTop: '20px', fontSize: '18px'}}>Signing you in...</div>
            </div>
        );
    }

    return null;
};

export default Callback;