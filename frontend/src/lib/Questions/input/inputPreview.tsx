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
    // Use a ref to track if this is the first render or a value-driven update
    const isFirstRender = useRef(true);
    const prevValueRef = useRef<string[]>(['']);

    // Initialize state safely
    const blankCount = question?.blankCount || 1;
    const defaultValue = Array(blankCount).fill('');
    const initialValue = Array.isArray(value) && value.length === blankCount
        ? value
        : defaultValue;

    const [answers, setAnswers] = useState<string[]>(initialValue);
    const [validationResult, setValidationResult] = useState<{ isValid: boolean; message?: string } | boolean>(true);

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

    // Update internal state when prop changes, but avoid calling onChange
    useEffect(() => {
        if (Array.isArray(value) &&
            JSON.stringify(value) !== JSON.stringify(prevValueRef.current)) {
            prevValueRef.current = [...value];
            setAnswers(value);
        }
    }, [value]);

    // Handle validation separately from onChange
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

    // When user changes an answer, update state and notify parent
    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;

        // Update local state
        setAnswers(newAnswers);

        // Notify parent, but avoid doing this on initial render or when
        // the change was triggered by the value prop
        if (!isFirstRender.current && onChange) {
            // Use setTimeout to break the potential update cycle
            setTimeout(() => {
                onChange(newAnswers);
            }, 0);
        }
    };

    // After first render, mark that we're no longer in first render
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }
    }, []);

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