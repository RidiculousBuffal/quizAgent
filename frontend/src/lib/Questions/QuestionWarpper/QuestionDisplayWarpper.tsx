import React from "react";
import {useQuestionStore} from "../../../store/question/QuestionStore";

interface QuestionDisplayWrapperProps {
    questionId: number;  // 只需要问题ID
}

const QuestionDisplayWrapper: React.FC<QuestionDisplayWrapperProps> = ({questionId}) => {
    // 从store中获取问题实例和对应的答案
    const question = useQuestionStore(state => state.findQuestion(questionId));
    const answer = useQuestionStore(state => state.findAnswer(questionId));

    if (!question) {
        return <div>问题不存在</div>;
    }

    // 获取问题的展示组件
    const DisplayComponent = question.displayComponent;

    return (
        <DisplayComponent
            question={question}
            answer={answer}
        />
    );
};

export default QuestionDisplayWrapper;