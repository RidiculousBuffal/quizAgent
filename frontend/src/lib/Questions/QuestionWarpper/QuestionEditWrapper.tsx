import { useShallow } from "zustand/react/shallow";
import { QuestionState, useQuestionStore } from "../../../store/question/QuestionStore.ts";
import { BaseQuestion } from "../BaseQuestion.ts";
import { App } from "antd";
import { toQuestionInstance } from "../../../store/question/questionSlice.ts";

function QuestionEditWrapper({ id }: { id: number }) {
    const { message } = App.useApp()

    const selectQuestionById = (id: number) => (state: QuestionState) =>
        state.questionAnswer.find(qa => qa.question.id === id)?.question;

    const question = toQuestionInstance(useQuestionStore(selectQuestionById(id))!);
    const updateQuestion = useQuestionStore(useShallow(state => state.updateQuestion))
    const handleQuestionChange = (questionId: number, newQuestion: BaseQuestion) => {
        try {
            updateQuestion(questionId, newQuestion)
        } catch (e) {
            message.error("问题更新失败").then()
            console.log(e)
        }
    }
    if (question == undefined) {
        return <></>
    } else {
        const EditComponent = question.getComponent();
        return <EditComponent question={question}
                              onChange={(updatedQuestion: any) => handleQuestionChange(id, updatedQuestion)}></EditComponent>
    }

}

export default QuestionEditWrapper