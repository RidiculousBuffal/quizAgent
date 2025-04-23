import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Typography,
    Space,
    Alert,
    Card,
} from 'antd';
import { FillBlankQuestion } from './input';
import { BaseQuestionPreviewParams } from '../BaseQuestion';
import './input.css';

const { Title, Paragraph, Text } = Typography;

// 添加卡片样式
const cardStyle = {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    borderRadius: '8px',
    marginBottom: '20px',
    overflow: 'hidden'
};

const cardHeaderStyle = {
    padding: '16px 24px',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fafafa'
};

const cardBodyStyle = {
    padding: '20px 24px'
};

const inputStyle = {
    borderRadius: '4px',
    transition: 'all 0.3s'
};

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
            <Paragraph style={{ lineHeight: '1.8' }}>
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        {part}
                        {index < parts.length - 1 && (
                            <span style={{ display: 'inline-block', margin: '0 4px', verticalAlign: 'middle' }}>
                                {question.answerType === 'number' ? (
                                    <InputNumber
                                        style={{ ...inputStyle, width: '120px' }}
                                        value={answers[index] === '' ? undefined : Number(answers[index])}
                                        onChange={(value) => handleAnswerChange(index, value?.toString() || '')}
                                        placeholder={question.placeholder}
                                        size="middle"
                                    />
                                ) : (
                                    <Input
                                        style={{ ...inputStyle, width: '120px', display: 'inline-block' }}
                                        value={answers[index]}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                        placeholder={question.placeholder}
                                        size="middle"
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
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                {Array.from({ length: question.blankCount }).map((_, index) => (
                    <Form.Item
                        key={index}
                        label={
                            <Text strong style={{ fontSize: '15px' }}>
                                {question.blankLabels[index]}
                            </Text>
                        }
                        required={question.isRequired}
                        style={{ marginBottom: '12px' }}
                    >
                        {question.answerType === 'number' ? (
                            <InputNumber
                                style={{ ...inputStyle, width: '100%' }}
                                value={answers[index] === '' ? undefined : Number(answers[index])}
                                onChange={(value) => handleAnswerChange(index, value?.toString() || '')}
                                placeholder={question.placeholder}
                                size="large"
                            />
                        ) : (
                            <Input
                                style={inputStyle}
                                value={answers[index]}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                placeholder={question.placeholder}
                                size="large"
                            />
                        )}
                    </Form.Item>
                ))}
            </Space>
        );
    };

    return (
        <div className="question-preview-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Card style={cardStyle} variant={"borderless"}>
                <div style={cardHeaderStyle}>
                    <Title level={4} style={{ margin: 0, fontSize: '18px' }}>{question.title}</Title>
                    {question.description && (
                        <Paragraph type="secondary" style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                            {question.description}
                        </Paragraph>
                    )}
                    {question.isRequired && (
                        <Text type="danger" style={{ fontSize: '13px', marginTop: '4px', display: 'block' }}>
                            * 此题为必答题
                        </Text>
                    )}
                </div>
                <div style={cardBodyStyle}>
                    {question.inlineMode ? renderInlineBlank() : renderStandardBlank()}

                    {showValidation && typeof validationResult !== 'boolean' && !validationResult.isValid && (
                        <Alert
                            message={validationResult.message || '输入有误，请检查'}
                            type="error"
                            showIcon
                            style={{ marginTop: 16, borderRadius: '4px' }}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default InputPreview;