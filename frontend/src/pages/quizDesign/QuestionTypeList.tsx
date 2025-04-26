import React from 'react';
import {Button, Space, Typography} from 'antd';
import {QuestionType} from "../../lib/Questions/QuestionType";

const {Title} = Typography;

interface QuestionTypeListProps {
    // 每个元素包含 type 字段（真正用于添加的 QuestionType）
    questionTypes: {
        key: string;
        icon: React.ReactNode;
        title: string;
        type: QuestionType;
    }[];
    onAddQuestion: (type: QuestionType) => void;
}

const QuestionTypeList: React.FC<QuestionTypeListProps> = ({questionTypes, onAddQuestion}) => (
    <div style={{marginBottom: '20px'}}>
        <Title level={5}>添加题目</Title>
        <Space direction="vertical" style={{width: '100%'}}>
            {questionTypes.map((item) => (
                <Button
                    key={item.key}
                    icon={item.icon}
                    onClick={() => onAddQuestion(item.type)}
                    style={{width: '100%', textAlign: 'left'}}
                >
                    {item.title}
                </Button>
            ))}
        </Space>
    </div>
);

export default QuestionTypeList;