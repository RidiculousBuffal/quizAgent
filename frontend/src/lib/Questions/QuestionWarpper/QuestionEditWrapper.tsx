import {useQuestionStore} from "../../../store/question/QuestionStore.ts";
import {BaseQuestion} from "../BaseQuestion.ts";
import {App} from "antd";
import {SingleChoiceQuestion} from "../radio/radio.ts";
import {MultipleChoiceQuestion} from "../checkbox/checkbox.ts";

function QuestionEditWrapper({id}: { id: number }) {
    const {message} = App.useApp()
    const question = useQuestionStore(state => state.findQuestion(id))
    const updateQuestion = useQuestionStore(state => state.updateQuestion)
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
        switch (question.type.typeName) {
            case "radio": {
                const radio = new SingleChoiceQuestion({...(question as SingleChoiceQuestion)})
                const EditComponent = radio.getComponent()
                return <EditComponent question={radio}
                                      onChange={(updatedQuestion: any) => handleQuestionChange(id, updatedQuestion)}></EditComponent>

            }
            case "checkbox": {
                const checkbox = new MultipleChoiceQuestion({...(question as MultipleChoiceQuestion)})
                const EditComponent = checkbox.getComponent()
                return <EditComponent question={checkbox}
                                      onChange={(updatedQuestion: any) => handleQuestionChange(id, updatedQuestion)}></EditComponent>
            }
            default:
                return <></>
        }
    }

}

export default QuestionEditWrapper