import React, {useState} from 'react';
import {QuestionFactory} from "../QuestionFactory.ts";
import {QuestionType} from '../QuestionType.ts';
import {BaseQuestion} from "../BaseQuestion.ts";
import {SingleChoiceQuestionParams} from "../radio/radio.ts";

function SingleChoiceTest() {
    // 用于更新问题的状态
    const [questions, setQuestions] = useState<BaseQuestion[]>([]);

    // 创建问题类型
    const singleChoiceType: QuestionType = {
        typeId: 2,
        typeName: 'radio',
        typeDescription: '从多个选项中选择一个'
    };

    // 创建新问题
    const newQuestion = QuestionFactory.createQuestion<SingleChoiceQuestionParams>(singleChoiceType, {
        id: Date.now(),
        sort: 1,
        allowOther: true,
        otherText: "自定义选项",
        title: '请选择您的性别',
        isRequired: true,
        options: [
            {id: '1', text: '男', value: '1'},
            {id: '2', text: '女', value: '2'}
        ]
    });

    // 保存问题到问卷
    const questionnaireData = {
        id: 'q-001',
        title: '用户调查问卷',
        questions: [newQuestion.toJSON()]
    };

    // 加载已有问卷 (只在组件初始化时执行一次)
    React.useEffect(() => {
        const loadedQuestions = questionnaireData.questions.map(q => QuestionFactory.fromJSON(q));
        setQuestions(loadedQuestions);
    }, []);

    // 处理问题更改
    const handleQuestionChange = (index: number, updatedQuestion: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = updatedQuestion;
        setQuestions(newQuestions);
    };

    // 处理答案更改
    const [answers, setAnswers] = useState<{ [key: number]: any }>({});

    const handleAnswerChange = (questionId: number, value: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    return (
        <div className="questionnaire-container">
            <h1>{questionnaireData.title}</h1>

            {questions.map((question, index) => {
                // 获取组件类型
                const PreviewComponent = question.getPreviewComponent();
                const EditComponent = question.getComponent();

                return (
                    <div key={question.id} className="question-container">
                        <h3>问题预览</h3>
                        <PreviewComponent
                            question={question}
                            value={answers[question.id] || question.getDefaultValue()}
                            onChange={(value: any) => handleAnswerChange(question.id, value)}
                            showValidation={true}
                        />

                        <h3>问题编辑</h3>
                        <EditComponent
                            question={question}
                            onChange={(updatedQuestion: any) => handleQuestionChange(index, updatedQuestion)}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default SingleChoiceTest;