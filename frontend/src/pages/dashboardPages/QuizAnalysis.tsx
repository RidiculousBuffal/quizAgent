import React from 'react';
import { Typography, Card } from 'antd';

const { Title } = Typography;

const QuizAnalysis: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Title level={4}>问卷分析</Title>
            <Card>
                <p>这里将展示您的问卷分析数据和图表。</p>
            </Card>
        </div>
    );
};

export default QuizAnalysis;