import {Route, Routes} from "react-router";
import Callback from "./pages/home/callback.tsx";
import Home from "./pages/home/HomePage.tsx";
import {useLogto} from "@logto/react";


function MyApp() {
    const {signIn, signOut, isAuthenticated} = useLogto();

    return <>
        {isAuthenticated ? (
            <button onClick={() => signOut(import.meta.env.VITE_APP_URL)}>Sign Out</button>
        ) : (
            <button onClick={() => signIn(`${import.meta.env.VITE_APP_URL}/callback`)}>Sign In</button>
        )}
        <>

            <Routes>
                // Assuming react-router
                <Route path="/callback" element={<Callback/>}/>
                <Route path="/home" element={<Home></Home>}></Route>
            </Routes>

        </>
    </>
}

export default MyApp
