import React from "react";
import QuestionPreviewWrapper from "../../QuestionWarpper/QuestionPreviewWrapper.tsx";
import {useQuestionStore} from "../../../../store/question/QuestionStore.ts";
import {useShallow} from "zustand/react/shallow";


const PreviewQuestions = () => {
    const questions = useQuestionStore(useShallow(state=>state.questionAnswer.map((qa) => qa.question)));

    return (
        <div>
            <h1>问卷预览模式</h1>
            {questions.map((question) => (
                <div key={question.id} style={{ marginBottom: 20 }}>
                    <QuestionPreviewWrapper id={question.id} />
                </div>
            ))}
        </div>
    );
};

export default PreviewQuestions;