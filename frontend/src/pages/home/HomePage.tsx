import {useLogto, type IdTokenClaims} from '@logto/react';
import {useEffect, useState} from 'react';

const Home = () => {
    const {isAuthenticated, getIdTokenClaims} = useLogto();
    const [user, setUser] = useState<IdTokenClaims>();

    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                const claims = await getIdTokenClaims();
                setUser(claims);
            }
        })();
    }, [getIdTokenClaims, isAuthenticated]);

    return <>
        {isAuthenticated && user ? (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(user).map(([key, value]) => (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{typeof value === 'string' ? value : JSON.stringify(value)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        ) : <>
            未登录
        </>}
    </>
}
export default Home