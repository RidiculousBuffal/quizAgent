import React from 'react';
import { Typography, Space } from 'antd';
import { FillBlankQuestion } from './input.ts';
import './input.css';
import '../base.css';

const { Text } = Typography;

interface FillBlankDisplayProps {
    question: FillBlankQuestion;
    answer: string[];
}

const FillBlankDisplay: React.FC<FillBlankDisplayProps> = ({ question, answer }) => {
    return (
        <div className="question-preview">
            <div className="question-title">
                {question.title}
                {question.isRequired && <span className="required-mark">*</span>}
            </div>

            {question.description && (
                <div className="question-description">{question.description}</div>
            )}

            <div className="fill-blank-answers">
                {question.blankLabels.map((label, index) => (
                    <div key={index} className="fill-blank-item" style={{ margin: '8px 0' }}>
                        <Space>
                            <Text strong>{label}:</Text>
                            <Text>{answer[index] || ''}</Text>
                        </Space>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FillBlankDisplay;