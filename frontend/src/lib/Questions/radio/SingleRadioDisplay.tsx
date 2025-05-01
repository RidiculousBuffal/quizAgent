// src/lib/Questions/radio/SingleRadioDisplay.tsx
import React from 'react';
import {Radio, Space, Typography} from 'antd';
import {SingleChoiceQuestion} from './radio.ts';
import './radio.css';
import '../base.css';

const {Text} = Typography;

interface SingleRadioDisplayProps {
    question: SingleChoiceQuestion;
    answer: string;
}

const SingleRadioDisplay: React.FC<SingleRadioDisplayProps> = ({question, answer}) => {
    // 检查是否为"其他"选项
    const isOtherAnswer = answer?.startsWith('other:');
    const otherValue = isOtherAnswer ? answer.substring(6) : '';

    // 确定Radio组的值
    const radioValue = isOtherAnswer ? 'other' : answer;

    return (
        <div className="question-preview">
            <div className="question-title">
                {question.title}
                {question.isRequired && <span className="required-mark">*</span>}
            </div>

            {question.description && (
                <div className="question-description">{question.description}</div>
            )}

            <Radio.Group value={radioValue} disabled>
                <Space direction="vertical">
                    {question.options.map((option) => (
                        <Radio
                            key={option.id || option.key || option.value}
                            value={option.value?.toString() || option.id || option.key}
                        >
                            {option.text}
                        </Radio>
                    ))}

                    {question.allowOther && isOtherAnswer && (
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Radio value="other">{question.otherText || "其他"}</Radio>
                            <div style={{marginLeft: 8}}>
                                <Text>{otherValue}</Text>
                            </div>
                        </div>
                    )}
                </Space>
            </Radio.Group>
        </div>
    );
};

export default SingleRadioDisplay;