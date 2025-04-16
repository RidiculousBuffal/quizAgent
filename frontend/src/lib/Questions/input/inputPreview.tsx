import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Typography,
    Space,
    Alert,
    Divider,
    Card
} from 'antd';
import { FillBlankQuestion } from './input';
import { BaseQuestionPreviewParams } from '../BaseQuestion';

const { Text, Title, Paragraph } = Typography;

interface InputPreviewProps extends BaseQuestionPreviewParams {
    question: FillBlankQuestion;
}

const InputPreview: React.FC<InputPreviewProps> = ({
                                                       question,
                                                       value,
                                                       onChange,
                                                       showValidation = false
                                                   }) => {
    const [answers, setAnswers] = useState<string[]>(value || question.getDefaultValue());
    const [validationResult, setValidationResult] = useState<{ isValid: boolean; message?: string } | boolean>(true);

    useEffect(() => {
        // 当外部value变化时更新内部状态
        if (value) {
            setAnswers(value);
        }
    }, [value]);

    useEffect(() => {
        // 当答案变化时，通知父组件
        onChange(answers);

        // 如果需要显示验证结果，则进行验证
        if (showValidation) {
            setValidationResult(question.validate(answers));
        }
    }, [answers, onChange, question, showValidation]);

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    // 渲染行内模式的填空题
    const renderInlineBlank = () => {
        if (!question.inlineText) return null;

        // 将文本按 {{blank}} 分割
        const parts = question.inlineText.split(/\{\{blank\}\}/g);

        return (
            <Paragraph>
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        {part}
                        {index < parts.length - 1 && (
                            <span style={{ display: 'inline-block', margin: '0 4px' }}>
                                {question.answerType === 'number' ? (
                                    <InputNumber
                                        style={{ width: '100px' }}
                                        value={answers[index] === '' ? undefined : Number(answers[index])}
                                        onChange={(value) => handleAnswerChange(index, value?.toString() || '')}
                                        placeholder={question.placeholder}
                                    />
                                ) : (
                                    <Input
                                        style={{ width: '100px', display: 'inline-block' }}
                                        value={answers[index]}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                        placeholder={question.placeholder}
                                    />
                                )}
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </Paragraph>
        );
    };

    // 渲染标准模式的填空题
    const renderStandardBlank = () => {
        return (
            <Space direction="vertical" style={{ width: '100%' }}>
                {Array.from({ length: question.blankCount }).map((_, index) => (
                    <Form.Item
                        key={index}
                        label={question.blankLabels[index]}
                        required={question.isRequired}
                    >
                        {question.answerType === 'number' ? (
                            <InputNumber
                                style={{ width: '100%' }}
                                value={answers[index] === '' ? undefined : Number(answers[index])}
                                onChange={(value) => handleAnswerChange(index, value?.toString() || '')}
                                placeholder={question.placeholder}
                            />
                        ) : (
                            <Input
                                value={answers[index]}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                placeholder={question.placeholder}
                            />
                        )}
                    </Form.Item>
                ))}
            </Space>
        );
    };

    return (
        <Card
            title={
                <div>
                    <Title level={5}>{question.title}</Title>
                    {question.description && (
                        <Paragraph type="secondary">{question.description}</Paragraph>
                    )}
                </div>
            }
            style={{ width: '100%', marginBottom: '16px' }}
        >
            {question.inlineMode ? renderInlineBlank() : renderStandardBlank()}

            {showValidation && typeof validationResult !== 'boolean' && !validationResult.isValid && (
                <Alert
                    message={validationResult.message || '输入有误，请检查'}
                    type="error"
                    showIcon
                    style={{ marginTop: 16 }}
                />
            )}
        </Card>
    );
};

export default InputPreview;