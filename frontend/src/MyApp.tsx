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
import QuizSquare from "./pages/home/QuizSquare.tsx";
import QuizAnalysisDetail from "./pages/dashboardPages/QuizAnalysisDetail.tsx";
import QuizAnalysisCenter from "./pages/dashboardPages/QuizAnalysis.tsx";
import ReceivedQuizzes from "./pages/dashboardPages/ReceivedQuizzes.tsx";


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
            <Route path="/quizComplete" element={<QuizCompletionPage/>}/>
            <Route path="/quizSquare" element={<QuizSquare/>}/>

            <Route path="/quiz-analysis" element={<ProtectedRoute element={<QuizAnalysisCenter/>}/>}/>
            <Route path="/quiz-analysis/:quizId" element={<ProtectedRoute element={<QuizAnalysisDetail/>}/>}/>
            <Route path="/quiz-responses/:quizId" element={<ProtectedRoute element={<ReceivedQuizzes/>}/>}/>
        </Routes>
        {/*<DebugFloater></DebugFloater>*/}
    </>
}

export default MyApp
