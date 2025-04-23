import React from "react";
import {useQuestionStore} from "../../../../store/question/QuestionStore.ts";
import QuestionEditWrapper from "../../QuestionWarpper/QuestionEditWrapper.tsx";
import {useShallow} from "zustand/react/shallow";


const EditQuestions = () => {
    const questions = useQuestionStore(useShallow((state) =>
        state.questionAnswer.map((qa) => qa.question))
    );

    return (
        <div>
            <h1>问卷编辑模式</h1>
            {questions.map((question) => (
                <QuestionEditWrapper key={question.id} id={question.id}/>
            ))}
        </div>
    );
};

export default EditQuestions;