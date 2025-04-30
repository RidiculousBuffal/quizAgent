import React, {useState, useEffect} from 'react';
import {Layout, Typography, Card, Input, Button, Tabs, Spin, Empty, Tag} from 'antd';
import {
    SearchOutlined,
    FireOutlined,
    RiseOutlined,
    ClockCircleOutlined,
    UserOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {quizDisplayType} from "../../api/types/questionType.ts";
import {getQuizDisplay} from "../../api/quizApi.ts";
import {useNavigate} from "react-router";

const {Header, Content, Footer} = Layout;
const {Title, Paragraph, Text} = Typography;

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [surveys, setSurveys] = useState<quizDisplayType[]>([]);
    const nav = useNavigate();

    useEffect(() => {
        const getQuizInfo = async () => {
            getQuizDisplay().then(r => {
                console.log(r);
                setSurveys(r ?? []);
            });
        }
        getQuizInfo();
        setLoading(false);
    }, []);

    // 格式化日期时间
    const formatDate = (dateString: string | number | Date | dayjs.Dayjs | null | undefined) => {
        return dayjs(dateString).format('YYYY-MM-DD HH:mm');
    };

    // 跳转到对应问卷
    const doQuizNow = (quizId: string) => {
        nav(`/doQuiz/${quizId}`)
    }

    // 计算问卷状态
    const getSurveyStatus = (startTime: string | number | Date | dayjs.Dayjs | null | undefined, endTime: string | number | Date | dayjs.Dayjs | null | undefined) => {
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

    const gradientColors = [
        {from: '#FF416C', to: '#FF4B2B'},  // 红色系
        {from: '#4776E6', to: '#8E54E9'},  // 紫蓝系
        {from: '#00B4DB', to: '#0083B0'},  // 蓝色系
        {from: '#FF8008', to: '#FFC837'},  // 橙黄系
        {from: '#16A085', to: '#F4D03F'},  // 绿黄系
        {from: '#667eea', to: '#764ba2'},  // 蓝紫系
        {from: '#11998e', to: '#38ef7d'},  // 绿色系
        {from: '#fc5c7d', to: '#6a82fb'},  // 粉蓝系
        {from: '#22c1c3', to: '#fdbb2d'},  // 青橙系
        {from: '#ff9966', to: '#ff5e62'},  // 橙红系
    ];


    // 渲染问卷列表内容
    const renderSurveyList = () => {
        if (loading) {
            return (
                <div style={{textAlign: 'center', padding: '40px 0'}}>
                    <Spin size="large"/>
                </div>
            );
        }

        if (surveys.length === 0) {
            return <Empty description="暂无问卷"/>;
        }

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 24
            }}>
                {surveys.map(survey => {
                    const status = getSurveyStatus(survey.quizStartTime, survey.quizEndTime);

                    return (
                        <Card
                            key={survey.quizId}
                            hoverable
                            style={{height: '100%', position: 'relative'}}
                            cover={
                                <div style={{
                                    height: 120,
                                    background: `linear-gradient(135deg, ${gradientColors[Math.floor(Math.random() * gradientColors.length)].from}, ${gradientColors[Math.floor(Math.random() * gradientColors.length)].to})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                    position: 'relative'
                                }}>
                                    <span>{survey.quizName}</span>
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
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: 6
                                }}>
                                    <Text style={{
                                        fontSize: 13,
                                        color: 'rgba(0,0,0,0.5)',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <CalendarOutlined style={{marginRight: 4}}/> 开始时间:
                                    </Text>
                                    <Text style={{
                                        fontSize: 13,
                                        marginLeft: 8
                                    }}>{formatDate(survey.quizStartTime)}</Text>
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
                                    <Text style={{
                                        fontSize: 13,
                                        marginLeft: 8
                                    }}>{formatDate(survey.quizEndTime)}</Text>
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

                            <Button type="primary" block onClick={() => doQuizNow(survey.quizId)}>
                                参与调查
                            </Button>
                        </Card>
                    );
                })}
            </div>
        );
    };

    // 定义Tab项
    const tabItems = [
        {
            key: '1',
            label: <span><FireOutlined/> 热门问卷</span>,
            children: renderSurveyList()
        },
        {
            key: '2',
            label: <span><RiseOutlined/> 最新发布</span>,
            children: <div>最新发布内容</div> // 这里可以替换为实际内容
        },
        {
            key: '3',
            label: <span><ClockCircleOutlined/> 即将结束</span>,
            children: <div>即将结束内容</div> // 这里可以替换为实际内容
        }
    ];

    const backToHome = () => {
        nav("/")
    }

    return (
        <Layout className="layout" style={{minHeight: '100vh'}}>
            <Header style={{background: '#fff', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%'}}>
                    <Title level={3} style={{margin: 0}}>问卷广场</Title>
                    <div>
                        <Button type="text" size="large"
                                style={{fontWeight: 500}} onClick={() => backToHome()}>回到主页</Button>
                    </div>
                </div>
            </Header>

            <Content style={{padding: '0 50px', marginTop: 30}}>
                <div className="hero-section" style={{textAlign: 'center', margin: '40px 0'}}>
                    <Title style={{fontSize: 48}}>发现 · 参与 · 分享</Title>
                    <Paragraph style={{fontSize: 18, margin: '20px 0 40px'}}>
                        探索各种有趣的问卷，分享你的观点和想法
                    </Paragraph>
                    <Input.Search
                        placeholder="搜索感兴趣的问卷..."
                        enterButton={<Button type="primary" icon={<SearchOutlined/>}>搜索</Button>}
                        style={{maxWidth: 600, width: '100%'}}
                    />
                </div>

                <div className="survey-list" style={{background: '#fff', padding: 24, minHeight: 500, borderRadius: 8}}>
                    <Tabs defaultActiveKey="1" size="large" items={tabItems}/>
                </div>
            </Content>

            <Footer style={{textAlign: 'center', background: '#f0f2f5'}}>
                问卷广场 ©{new Date().getFullYear()} 提供优质的问卷服务
            </Footer>
        </Layout>
    );
};

export default HomePage;