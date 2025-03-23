import {useQuestionStore} from "../../../store/question/QuestionStore.ts";
import {App} from "antd";

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
        const PreviewComponent = question.getPreviewComponent()
        return <PreviewComponent question={question} value={answer || question.getDefaultValue()}
                                 onChange={(value: any) => {
                                     handleAnswerChange(id, value)
                                 }} showValidation={true}/>
    }

}

export default QuestionPreviewWrapper