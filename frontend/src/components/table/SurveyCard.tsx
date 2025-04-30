import React from 'react';
import {Card, Tag, Typography, Button} from 'antd';
import {CalendarOutlined, UserOutlined} from '@ant-design/icons';
import {quizDisplayType} from "../../api/types/questionType";
import dayjs from 'dayjs';
import {getRandomGradient} from '../utils/colorUtils.ts';

const {Paragraph, Text} = Typography;
interface SurveyCardProps {
    survey: quizDisplayType;
    onClick: (quizId: string) => void;
}

// 格式化日期时间
const formatDate = (dateString: string | number | Date | dayjs.Dayjs | null | undefined) => {
    return dayjs(dateString).format('YYYY-MM-DD HH:mm');
};

// 计算问卷状态
const getSurveyStatus = (startTime: string | number | Date | dayjs.Dayjs | null | undefined,
                         endTime: string | number | Date | dayjs.Dayjs | null | undefined) => {
    const now = dayjs();
    const start = dayjs(startTime);
    const end = dayjs(endTime);

    if (now.isBefore(start)) {
        return {status: 'upcoming', text: '即将开始', color: 'blue'};
    } else if (now.isAfter(end)) {
        return {status: 'ended', text: '已结束', color: 'gray'};
    } else {
        return {status: 'active', text: '进行中', color: 'green'};
    }
};

const SurveyCard: React.FC<SurveyCardProps> = ({survey, onClick}) => {
    const status = getSurveyStatus(survey.quizStartTime, survey.quizEndTime);

    return (
        <Card
            hoverable
            style={{height: '100%', position: 'relative'}}
            cover={
                <div style={{
                    height: 120,
                    background: `linear-gradient(135deg, ${getRandomGradient().from}, ${getRandomGradient().to})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 24,
                    fontWeight: 'bold',
                    position: 'relative'
                }}>
                    <span style={{textShadow: '0 1px 3px rgba(0,0,0,0.3)'}}>{survey.quizName}</span>
                    <div style={{position: 'absolute', top: 10, right: 10}}>
                        <Tag color={status.color}>{status.text}</Tag>
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        fontSize: 14,
                        opacity: 0.8
                    }}>
                        ID: {survey.quizId}
                    </div>
                </div>
            }
        >
            <div style={{marginBottom: 12}}>
                <Paragraph ellipsis={{rows: 2}}
                           style={{fontSize: 14, color: 'rgba(0,0,0,0.65)'}}>
                    {survey.quizDescription}
                </Paragraph>
            </div>

            <div style={{marginBottom: 12}}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: 6}}>
                    <Text style={{
                        fontSize: 13,
                        color: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <CalendarOutlined style={{marginRight: 4}}/> 开始时间:
                    </Text>
                    <Text style={{fontSize: 13, marginLeft: 8}}>
                        {formatDate(survey.quizStartTime)}
                    </Text>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 13,
                        color: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <CalendarOutlined style={{marginRight: 4}}/> 结束时间:
                    </Text>
                    <Text style={{fontSize: 13, marginLeft: 8}}>
                        {formatDate(survey.quizEndTime)}
                    </Text>
                </div>
            </div>

            <div style={{marginBottom: 16, display: 'flex', alignItems: 'center'}}>
                <UserOutlined style={{color: 'rgba(0,0,0,0.45)', marginRight: 6}}/>
                <Text style={{fontSize: 14}}>创建者: {survey.userName}</Text>
                <Text style={{
                    fontSize: 12,
                    color: 'rgba(0,0,0,0.45)',
                    marginLeft: 'auto'
                }}>
                    已有 {survey.responses} 人参与
                </Text>
            </div>

            <Button type="primary" block onClick={() => onClick(survey.quizId)}>
                参与调查
            </Button>
        </Card>
    );
};

export default SurveyCard;