import {useQuestionStore} from "../../../store/question/QuestionStore.ts";
import {BaseQuestion} from "../BaseQuestion.ts";
import {App} from "antd";

function QuestionEditWrapper({id}: { id: number }) {
    const {message} = App.useApp()
    const question = useQuestionStore(state => state.findQuestion(id))
    const updateQuestion = useQuestionStore(state => state.updateQuestion)
    const handleQuestionChange = (questionId: number, newQuestion: BaseQuestion) => {
        try {
            updateQuestion(questionId, newQuestion)
            message.success("问题更新成功").then()
        } catch (e) {
            message.error("问题更新失败").then()
            console.log(e)
        }
    }
    if (question == undefined) {
        return <></>
    } else {
        const EditComponent = question.getComponent()
        return <EditComponent question={question}
                              onChange={(updatedQuestion: any) => handleQuestionChange(id, updatedQuestion)}></EditComponent>
    }

}

export default QuestionEditWrapper