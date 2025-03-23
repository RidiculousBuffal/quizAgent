import {useQuestionStore} from "../../../store/question/QuestionStore.ts";
import {App} from "antd";
import {SingleChoiceQuestion} from "../radio/radio.ts";
import {MultipleChoiceQuestion} from "../checkbox/checkbox.ts";

function QuestionPreviewWrapper({id}: { id: number }) {
    const question = useQuestionStore(state => state.findQuestion(id))
    const {message} = App.useApp()
    const answer = useQuestionStore(state => state.findAnswer(id))
    const setAnswer = useQuestionStore(state => state.setAnswer)
    const handleAnswerChange = (questionId: number, value: any) => {
        try {
            setAnswer(id, value)
        } catch (_) {
            message.error("opps")
        }
    }
    if (question == undefined) {
        return <></>
    } else {
        switch (question.type.typeName) {
            // zustand 不缓存类中的函数
            case "radio": {
                const radio = new SingleChoiceQuestion({...(question as SingleChoiceQuestion)})
                const PreviewComponent = radio.getPreviewComponent()
                return <PreviewComponent question={radio}
                                         value={answer || radio.getDefaultValue()}
                                         onChange={(value: any) => {
                                             handleAnswerChange(id, value)
                                         }} showValidation={true}/>
            }
            case "checkbox": {
                const checkbox = new MultipleChoiceQuestion({...(question as MultipleChoiceQuestion)})
                const PreviewComponent = checkbox.getPreviewComponent()
                return <PreviewComponent question={checkbox }
                                         value={answer || checkbox.getDefaultValue()}
                                         onChange={(value: any) => {
                                             handleAnswerChange(id, value)
                                         }} showValidation={true}/>
            }
            default:
                return <></>
        }
    }

}

export default QuestionPreviewWrapper