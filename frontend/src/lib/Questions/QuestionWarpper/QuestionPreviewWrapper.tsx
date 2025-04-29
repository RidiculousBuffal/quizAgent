// src/lib/Questions/QuestionWarpper/QuestionPreviewWrapper.tsx
import React from "react";
import { useQuestionStore } from "../../../store/question/QuestionStore";

interface QuestionPreviewWrapperProps {
    id: number;
    questionValue?: any;
    onValueChange?: (value: any) => void;
    showValidation?: boolean;
}

const QuestionViewWrapper: React.FC<QuestionPreviewWrapperProps> = ({
                                                                        id,
                                                                        questionValue,
                                                                        onValueChange,
                                                                        showValidation = false
                                                                    }) => {
    // Use store to find the question
    const question = useQuestionStore(state => state.findQuestion(id));

    // Only get the store answer if we're not being passed a value and onChange
    const storeAnswer = useQuestionStore(state =>
        !onValueChange ? state.findAnswer(id) : null
    );

    const setStoreAnswer = useQuestionStore(state => state.setAnswer);

    if (!question) {
        return <div>Question not found</div>;
    }

    // Use the passed value and onChange if provided (answering mode)
    // or fall back to store values (preview mode)
    const value = questionValue !== undefined ? questionValue : storeAnswer;
    const handleChange = onValueChange || ((val: any) => setStoreAnswer(id, val));

    // Get the preview component from the question
    const PreviewComponent = question.previewComponent;

    return (
        <PreviewComponent
            question={question}
            value={value}
            onChange={handleChange}
            showValidation={showValidation}
        />
    );
};

export default QuestionViewWrapper;