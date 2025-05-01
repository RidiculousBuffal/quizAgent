import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { FormOutlined, LineChartOutlined, TeamOutlined } from '@ant-design/icons';

interface SurveyStatisticsProps {
    surveyCount: number;
    totalResponses: number | null;
}

const SurveyStatistics: React.FC<SurveyStatisticsProps> = ({
                                                               surveyCount,
                                                               totalResponses
                                                           }) => {
    return (
        <Row gutter={[24, 24]} style={{ marginBottom: '24px', flexShrink: 0 }}>
            <Col xs={24} md={8}>
                <Card>
                    <Statistic
                        title="已创建问卷数量"
                        value={surveyCount}
                        prefix={<FormOutlined />}
                    />
                </Card>
            </Col>
            <Col xs={24} md={8}>
                <Card>
                    <Statistic
                        title="得到的总回复"
                        value={totalResponses ?? 0}
                        prefix={<TeamOutlined />}
                    />
                </Card>
            </Col>
            <Col xs={24} md={8}>
                <Card>
                    <Statistic
                        title="问卷完成率"
                        value={0}
                        suffix="%"
                        prefix={<LineChartOutlined />}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default SurveyStatistics;