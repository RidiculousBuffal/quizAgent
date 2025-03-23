import React, {useEffect, useState} from "react";
import {useQuestionStore} from "../../../../store/question/QuestionStore.ts";
import {mockQuestionsJSON} from "./datas.ts";
import {QuestionFactory} from "../../QuestionFactory.ts";
import EditQuestions from "./Edit.tsx";
import PreviewQuestions from "./Preview.tsx";


const CRTEST = () => {
    const setQuestions = useQuestionStore((state) => state.setRawQuestions);
    const [isEditMode, setIsEditMode] = useState(true);
    useEffect(() => {
        // 模拟从后端获取数据
        const questions = mockQuestionsJSON.map((questionJSON) =>
            QuestionFactory.fromJSON(questionJSON)
        );

        // 将问题列表同步至 Zustand
        setQuestions(questions);
    }, [setQuestions]);

    return (
        <div>
            <button onClick={() => setIsEditMode(!isEditMode)}>
                切换到{isEditMode ? "预览模式" : "编辑模式"}
            </button>

            {isEditMode ? <EditQuestions/> : <PreviewQuestions/>}
        </div>
    );
};

export default CRTEST;