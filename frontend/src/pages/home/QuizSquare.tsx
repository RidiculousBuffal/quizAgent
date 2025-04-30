// src/pages/HomePage/index.tsx

import React, { useState, useEffect } from 'react';
import { Layout, Typography, Input, Button, Tabs } from 'antd';
import { SearchOutlined, FireOutlined } from '@ant-design/icons';
import { quizDisplayType } from "../../api/types/questionType";
import { getQuizDisplay } from "../../api/quizApi";
import { useNavigate } from "react-router";
import SurveyList from '../../components/table/SurveyList.tsx';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const QuizSquare: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [surveys, setSurveys] = useState<quizDisplayType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const data = await getQuizDisplay();
                setSurveys(data ?? []);
            } catch (error) {
                console.error('获取问卷数据失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizData();
    }, []);

    // 跳转到对应问卷
    const handleSurveyClick = (quizId: string) => {
        navigate(`/doQuiz/${quizId}`);
    };

    // 返回主页
    const backToHome = () => {
        navigate("/");
    };

    // 定义Tab项 - 只保留热门问卷
    const tabItems = [
        {
            key: '1',
            label: <span><FireOutlined /> 热门问卷</span>,
            children: (
                <SurveyList
                    loading={loading}
                    surveys={surveys}
                    onSurveyClick={handleSurveyClick}
                />
            )
        }
    ];

    const searchFilteredQuiz = async (value: string) => {
        setLoading(true)
        const data = await getQuizDisplay(value);
        setSurveys(data ?? []);
        setLoading(false)
    }

    return (
        <Layout className="layout" style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#fff', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                    <Title level={3} style={{ margin: 0 }}>问卷广场</Title>
                    <div>
                        <Button
                            type="text"
                            size="large"
                            style={{ fontWeight: 500 }}
                            onClick={backToHome}
                        >
                            回到主页
                        </Button>
                    </div>
                </div>
            </Header>

            <Content style={{ padding: '0 50px', marginTop: 30 }}>
                <div className="hero-section" style={{ textAlign: 'center', margin: '40px 0' }}>
                    <Title style={{ fontSize: 48 }}>发现 · 参与 · 分享</Title>
                    <Paragraph style={{ fontSize: 18, margin: '20px 0 40px' }}>
                        探索各种有趣的问卷，分享你的观点和想法
                    </Paragraph>
                    <Input.Search
                        placeholder="搜索感兴趣的问卷..."
                        enterButton={<Button type="primary" icon={<SearchOutlined />}>搜索</Button>}
                        style={{ maxWidth: 600, width: '100%' }}
                        onSearch={(value) => searchFilteredQuiz(value)}
                    />
                </div>

                <div className="survey-list" style={{ background: '#fff', padding: 24, minHeight: 500, borderRadius: 8 }}>
                    <Tabs defaultActiveKey="1" size="large" items={tabItems} />
                </div>
            </Content>

            <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
                问卷广场 ©{new Date().getFullYear()} 提供优质的问卷服务
            </Footer>
        </Layout>
    );
};

export default QuizSquare;