import React from 'react';
import { Checkbox, Space, Typography } from 'antd';
import { MultipleChoiceQuestion } from './checkbox.ts';

import '../base.css';

const { Text } = Typography;

interface MultiChoiceDisplayProps {
    question: MultipleChoiceQuestion;
    answer: string[];
}

const MultiChoiceDisplay: React.FC<MultiChoiceDisplayProps> = ({ question, answer }) => {
    // 处理常规答案和"其他"答案
    const regularAnswers = answer.filter(ans => !ans.startsWith('other:'));
    const otherAnswer = answer.find(ans => ans.startsWith('other:'));
    const otherValue = otherAnswer ? otherAnswer.substring(6) : '';

    return (
        <div className="question-preview">
            <div className="question-title">
                {question.title}
                {question.isRequired && <span className="required-mark">*</span>}
            </div>

            {question.description && (
                <div className="question-description">{question.description}</div>
            )}

            <Checkbox.Group value={regularAnswers} disabled>
                <Space direction="vertical">
                    {question.options.map((option) => (
                        <Checkbox
                            key={option.id || option.key || option.value}
                            value={option.value?.toString() || option.id || option.key}
                        >
                            {option.text}
                        </Checkbox>
                    ))}
                </Space>
            </Checkbox.Group>

            {question.allowOther && otherAnswer && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <Checkbox checked disabled>{question.otherText || "其他"}</Checkbox>
                    <div style={{ marginLeft: 8 }}>
                        <Text>{otherValue}</Text>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiChoiceDisplay;