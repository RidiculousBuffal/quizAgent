import React, {useState, useEffect, useRef} from 'react';
import {
    Form,
    Input,
    InputNumber,
    Typography,
    Space,
    Alert,
    Card,
} from 'antd';
import {FillBlankQuestion} from './input';
import {BaseQuestionPreviewParams} from '../BaseQuestion';
import './input.css';

const {Title, Paragraph, Text} = Typography;

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
    // 初始化逻辑
    const blankCount = question?.blankCount || 1;
    const defaultValue = Array(blankCount).fill('');

    // 使用一个更可靠的方式来管理内部状态
    const [answers, setAnswers] = useState<string[]>(() => {
        // 确保初始值是有效的
        if (Array.isArray(value) && value.length === blankCount) {
            return [...value]; // 创建新数组，避免引用问题
        }
        return [...defaultValue];
    });

    // 添加 questionId 作为 ref，用来追踪是否切换了问题
    const questionIdRef = useRef<number>(question?.id);
    const [validationResult, setValidationResult] = useState<{ isValid: boolean; message?: string } | boolean>(true);

    // 当问题ID变化或value变化时，重置内部状态
    useEffect(() => {
        // 检测到不同的问题ID，重置状态
        if (questionIdRef.current !== question?.id) {
            questionIdRef.current = question?.id;

            // 新问题，重新初始化答案
            if (Array.isArray(value) && value.length === blankCount) {
                setAnswers([...value]);
            } else {
                setAnswers([...defaultValue]);
            }
            return;
        }

        // 同一个问题但value更新了
        if (Array.isArray(value) && value.length === blankCount) {
            // 进行深比较，避免不必要的更新
            const needsUpdate = value.some((v, i) => v !== answers[i]);
            if (needsUpdate) {
                setAnswers([...value]); // 创建新数组，避免引用问题
            }
        }
    }, [value, question?.id, blankCount, defaultValue]);

    // 验证逻辑
    useEffect(() => {
        if (showValidation && typeof question?.validate === 'function') {
            try {
                const result = question.validate(answers);
                setValidationResult(result);
            } catch (error) {
                console.error('Validation error:', error);
                setValidationResult({isValid: false, message: '验证过程出错'});
            }
        }
    }, [answers, question, showValidation]);

    // 用户更改答案处理函数
    const handleAnswerChange = (index: number, newValue: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = newValue;

        // 更新内部状态
        setAnswers(newAnswers);

        // 通知父组件
        if (onChange) {
            onChange(newAnswers);
        }
    };

    // 安全获取属性的辅助函数
    const getBlankCount = () => question?.blankCount || 1;
    const getBlankLabels = () => question?.blankLabels || [];
    const getAnswerType = () => question?.answerType || 'text';
    const getPlaceholder = () => question?.placeholder || '请在此输入';
    const isInlineMode = () => question?.inlineMode || false;
    const getInlineText = () => question?.inlineText || '';
    const isRequired = () => question?.isRequired || false;
    const getTitle = () => question?.title || '';
    const getDescription = () => question?.description || '';

    // 渲染行内模式的填空题
    const renderInlineBlank = () => {
        const inlineText = getInlineText();
        if (!inlineText) return null;

        // 将文本按 {{blank}} 分割
        const parts = inlineText.split(/\{\{blank\}\}/g);
        const answerType = getAnswerType();
        const placeholder = getPlaceholder();

        return (
            <Paragraph style={{lineHeight: '1.8'}}>
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        {part}
                        {index < parts.length - 1 && (
                            <span style={{display: 'inline-block', margin: '0 4px', verticalAlign: 'middle'}}>
                                {answerType === 'number' ? (
                                    <InputNumber
                                        style={{...inputStyle, width: '120px'}}
                                        value={answers[index] === '' ? undefined : Number(answers[index])}
                                        onChange={(value) => handleAnswerChange(index, value?.toString() || '')}
                                        placeholder={placeholder}
                                        size="middle"
                                    />
                                ) : (
                                    <Input
                                        style={{...inputStyle, width: '120px', display: 'inline-block'}}
                                        value={answers[index]}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                        placeholder={placeholder}
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
        const blankCount = getBlankCount();
        const blankLabels = getBlankLabels();
        const answerType = getAnswerType();
        const placeholder = getPlaceholder();
        const required = isRequired();

        return (
            <Space direction="vertical" style={{width: '100%'}} size="large">
                {Array.from({length: blankCount}).map((_, index) => (
                    <Form.Item
                        key={index}
                        label={
                            <Text strong style={{fontSize: '15px'}}>
                                {blankLabels[index] || `填空 ${index + 1}`}
                            </Text>
                        }
                        required={required}
                        style={{marginBottom: '12px'}}
                    >
                        {answerType === 'number' ? (
                            <InputNumber
                                style={{...inputStyle, width: '100%'}}
                                value={answers[index] === '' ? undefined : Number(answers[index])}
                                onChange={(value) => handleAnswerChange(index, value?.toString() || '')}
                                placeholder={placeholder}
                                size="large"
                            />
                        ) : (
                            <Input
                                style={inputStyle}
                                value={answers[index]}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                placeholder={placeholder}
                                size="large"
                            />
                        )}
                    </Form.Item>
                ))}
            </Space>
        );
    };

    return (
        <div className="question-preview-container" style={{maxWidth: '800px', margin: '0 auto'}}>
            <Card style={cardStyle} variant={"borderless"}>
                <div style={cardHeaderStyle}>
                    <Title level={4} style={{margin: 0, fontSize: '18px'}}>{getTitle()}</Title>
                    {getDescription() && (
                        <Paragraph type="secondary" style={{margin: '8px 0 0 0', fontSize: '14px'}}>
                            {getDescription()}
                        </Paragraph>
                    )}
                    {isRequired() && (
                        <Text type="danger" style={{fontSize: '13px', marginTop: '4px', display: 'block'}}>
                            * 此题为必答题
                        </Text>
                    )}
                </div>
                <div style={cardBodyStyle}>
                    {isInlineMode() ? renderInlineBlank() : renderStandardBlank()}

                    {showValidation && typeof validationResult !== 'boolean' && !validationResult.isValid && (
                        <Alert
                            message={validationResult.message || '输入有误，请检查'}
                            type="error"
                            showIcon
                            style={{marginTop: 16, borderRadius: '4px'}}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default InputPreview;