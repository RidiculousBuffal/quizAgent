import {Navigate, Route, Routes} from "react-router";
import Callback from "./pages/home/callback.tsx";

import Dashboard from "./pages/home/DashBoard.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import ProtectedRoute from "./components/auth/protectedRoute.tsx";
import {DebugFloater} from "./components/debug/debugButton.tsx";
import MainDesign from "./pages/quizDesign/MainDesign.tsx";
import '../index.css'
import DoQuizPage from "./pages/doQuiz/DoQuizPage.tsx";
import QuizCompletionPage from "./pages/doQuiz/QuizCompletionPage.tsx";

// Protected route component


function MyApp() {
    return <>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/callback" element={<Callback/>}/>
            <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Dashboard/>}/>}
            />
            <Route path="*" element={<Navigate to="/"/>}/>
            <Route path="/quizdesign" element={<MainDesign/>}/>
            <Route path="/doQuiz/:quizId" element={<DoQuizPage/>}/>
            <Route path="/quizComplete" element={<QuizCompletionPage />}/>
        </Routes>
        <DebugFloater></DebugFloater>
    </>
}

export default MyApp
