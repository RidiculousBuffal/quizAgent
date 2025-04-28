import { useQuestionStore } from "../../../store/question/QuestionStore.ts";
import { App } from "antd";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";

function QuestionPreviewWrapper({ id }: { id: number }) {
    const question = useQuestionStore(useShallow(state => state.findQuestion(id)))
    const { message } = App.useApp()
    const answer = useQuestionStore(useShallow(state => state.findAnswer(id)))
    const setAnswer = useQuestionStore(useShallow(state => state.setAnswer))

    // Use useCallback to prevent unnecessary re-renders
    const handleAnswerChange = useCallback((value: any) => {
        try {
            // Only update the store if the value has actually changed
            if (JSON.stringify(value) !== JSON.stringify(answer)) {
                setAnswer(id, value)
            }
        } catch (error) {
            console.error("Error updating answer:", error);
            message.error("发生错误，无法保存答案")
        }
    }, [id, setAnswer, answer, message]);

    if (question == undefined) {
        return <></>
    } else {
        const PreviewComponent = question.getPreviewComponent()
        return <PreviewComponent
            question={question}
            value={answer || question.getDefaultValue()}
            onChange={handleAnswerChange}
            showValidation={true}
        />
    }
}

export default QuestionPreviewWrapper