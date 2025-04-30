// QuestionTest.tsx（续）
import React, { useState, useEffect } from 'react';
import { QuestionFactory } from "../QuestionFactory.ts";

import { Card, Divider, message } from 'antd';
import {QuestionType} from "../QuestionType.ts";
import {MultiChoiceParams} from "../checkbox/checkbox.ts";

function QuestionTest() {
    // 用于更新问题的状态
    const [questions, setQuestions] = useState<any[]>([]);

    // 创建多选题类型
    const multipleChoiceType: QuestionType = {
        typeId: 3,
        typeName: 'checkbox',
        typeDescription: '从多个选项中选择多个'
    };

    // 创建新的多选题
    const newQuestion = QuestionFactory.createQuestion<MultiChoiceParams>(multipleChoiceType, {
        id: Date.now(),
        sort: 1,
        title: '您喜欢的水果有哪些？',
        isRequired: true,
        options: [
            {id: '1', text: '苹果', value: '1'},
            {id: '2', text: '香蕉', value: '2'},
            {id: '3', text: '橙子', value: '3'},
            {id: '4', text: '葡萄', value: '4'},
            {id: '5', text: '西瓜', value: '5'},
        ],
        allowOther: true,
        otherText: '其他水果',
        minSelected: 1,
        maxSelected: 3,
        randomizeOptions: true,
        displayInColumns: 2,
        exclusiveOptions: ['5'] // 西瓜是互斥选项
    });

    // 保存问题到问卷
    const questionnaireData = {
        id: 'q-001',
        title: '水果偏好调查',
        questions: [newQuestion.toJSON()]
    };

    // 加载已有问卷 (只在组件初始化时执行一次)
    useEffect(() => {
        const loadedQuestions = questionnaireData.questions.map(q => QuestionFactory.fromJSON(q));
        setQuestions(loadedQuestions);
    }, []);

    // 处理问题更改
    const handleQuestionChange = (index: number, updatedQuestion: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = updatedQuestion;
        setQuestions(newQuestions);

        // 更新后显示提示
        message.success('问题已更新');

        // 更新问卷数据（实际应用中可能需要保存到后端）
        const updatedQuestionnaire = {
            ...questionnaireData,
            questions: newQuestions.map(q => q.toJSON())
        };
        console.log('问卷数据已更新:', updatedQuestionnaire);
    };

    // 处理答案更改
    const [answers, setAnswers] = useState<{[key: number]: any}>({});

    const handleAnswerChange = (questionId: number, value: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
        console.log('答案已更新:', questionId, value);
    };

    // 提交问卷答案
    const handleSubmit = () => {
        // 验证所有问题
        const validationResults = questions.map(question => {
            const answer = answers[question.id] || question.getDefaultValue();
            const result = question.validate(answer);
            return {
                questionId: question.id,
                result: result
            };
        });

        // 检查是否有验证失败的问题
        const invalidQuestions = validationResults.filter(
            item => typeof item.result !== 'boolean' || item.result === false
        );

        if (invalidQuestions.length > 0) {
            // 有验证失败的问题
            message.error('请完成所有必填问题');
            console.log('验证失败的问题:', invalidQuestions);
            return;
        }

        // 所有问题验证通过，可以提交答案
        const submissionData = {
            questionnaireId: questionnaireData.id,
            answers: Object.entries(answers).map(([questionId, value]) => ({
                questionId: parseInt(questionId),
                value: value
            }))
        };

        console.log('提交的答案数据:', submissionData);
        message.success('问卷提交成功！');
    };

    // 添加新问题
    const addNewQuestion = () => {
        // 创建一个新的多选题实例
        const newMultipleQuestion = QuestionFactory.createQuestion(multipleChoiceType, {
            id: Date.now(),
            sort: questions.length + 1,
            title: '新的多选题问题',
            isRequired: false,
            options: [
                {id: 1, text: '选项1', value: '1'},
                {id: 2, text: '选项2', value: '2'},
            ],
            displayInColumns: 1
        });

        // 添加到问题列表
        setQuestions([...questions, newMultipleQuestion]);
        message.success('已添加新问题');
    };

    // 删除问题
    const deleteQuestion = (index: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
        message.success('问题已删除');
    };

    return (
        <div className="questionnaire-container" style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: 24 }}>{questionnaireData.title}</h1>

            {questions.map((question, index) => {
                // 获取组件类型
                const PreviewComponent = question.getPreviewComponent();
                const EditComponent = question.getComponent();

                return (
                    <div key={question.id} className="question-container" style={{ marginBottom: 32 }}>
                        <Card
                            title={`问题 ${index + 1} 预览`}
                            style={{ marginBottom: 16 }}
                            extra={
                                <a onClick={() => deleteQuestion(index)}>删除问题</a>
                            }
                        >
                            <PreviewComponent
                                question={question}
                                value={answers[question.id] || question.getDefaultValue()}
                                onChange={(value: any) => handleAnswerChange(question.id, value)}
                                showValidation={true}
                            />
                        </Card>

                        <Card title={`问题 ${index + 1} 编辑`}>
                            <EditComponent
                                question={question}
                                onChange={(updatedQuestion: any) => handleQuestionChange(index, updatedQuestion)}
                            />
                        </Card>

                        <Divider />
                    </div>
                );
            })}

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
                <button
                    onClick={addNewQuestion}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#1890ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                    }}
                >
                    添加新问题
                </button>

                <button
                    onClick={handleSubmit}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#52c41a',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                    }}
                >
                    提交问卷
                </button>
            </div>

            <div style={{ marginTop: 32 }}>
                <h3>当前答案数据：</h3>
                <pre style={{
                    backgroundColor: '#f5f5f5',
                    padding: 16,
                    borderRadius: 4,
                    overflow: 'auto'
                }}>
                    {JSON.stringify(answers, null, 2)}
                </pre>
            </div>
        </div>
    );
}

export default QuestionTest;