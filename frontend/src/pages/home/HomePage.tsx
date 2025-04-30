import React from 'react';
import {Layout, Typography, Button, Row, Col, Card, Space, Progress} from 'antd';
import {useLogto} from '@logto/react';
import {RobotOutlined, FormOutlined, LineChartOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router";
import {logout, useUserStore} from "../../store/user/UserStore.ts";

const {Header, Content, Footer} = Layout;
const {Title, Paragraph} = Typography;

const HomePage: React.FC = () => {
    const {signIn, signOut, isAuthenticated} = useLogto();
    const isSignedBackend = useUserStore(state => state.isSignedIn)
    const nav = useNavigate();

    return (
        <Layout className="layout" style={{minHeight: '100vh', background: '#f8f9fa'}}>
            <Header style={{
                background: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 50px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                borderBottom: '1px solid #eee'
            }}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <RobotOutlined style={{
                        fontSize: '28px',
                        marginRight: '16px',
                        color: '#333',
                        transform: 'rotate(-10deg)'
                    }}/>
                    <Title level={3} style={{margin: 0, color: '#333', fontWeight: 600}}>AI Quiz Agent</Title>
                </div>
                <Space size="large">
                    <Button
                        size="large"
                        type="text"
                        style={{fontWeight: 500}}
                        onClick={() => nav('/quizSquare')}
                    >
                        QuizSquare
                    </Button>
                    <Button
                        size="large"
                        type="text"
                        style={{fontWeight: 500}}
                        onClick={() => nav('/dashboard')}
                    >
                        DashBoard
                    </Button>
                    <Button
                        type="text"
                        size="large"
                        style={{fontWeight: 500}}
                        onClick={() => isAuthenticated ?
                            signOut(import.meta.env.VITE_APP_URL).then(logout) :
                            signIn(`${import.meta.env.VITE_APP_URL}/callback`)}
                    >
                        {isAuthenticated && isSignedBackend ? "Sign Out" : "Sign In"}
                    </Button>
                </Space>
            </Header>

            <Content style={{padding: '80px 50px'}}>
                <Row gutter={[48, 48]} align="middle" justify="center">
                    <Col xs={24} md={12}>
                        <div style={{
                            borderRadius: '16px',
                            background: '#fff',
                            padding: '40px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                            border: '1px solid #eee'
                        }}>
                            {/* 数据可视化组合 */}
                            <div style={{
                                position: 'relative',
                                height: '400px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                {/* 环形进度条 */}
                                <div style={{position: 'absolute', transform: 'rotate(15deg)'}}>
                                    <Progress
                                        type="circle"
                                        percent={78}
                                        strokeColor="#333"
                                        trailColor="#eee"
                                        size={160}
                                        strokeWidth={8}
                                        format={() => ''}
                                    />
                                </div>

                                {/* 波形图 */}
                                <div style={{
                                    position: 'absolute',
                                    width: '70%',
                                    height: '120px',
                                    bottom: '20%',
                                    background: `repeating-linear-gradient(
                                      45deg,
                                      #eee,
                                      #eee 10px,
                                      transparent 10px,
                                      transparent 20px
                                    )`
                                }}/>

                                {/* 动态点阵 */}
                                <div style={{
                                    display: 'flex',
                                    gap: '24px',
                                    transform: 'rotate(-10deg)'
                                }}>
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} style={{
                                            width: '60px',
                                            height: '60px',
                                            background: '#333',
                                            borderRadius: item % 2 ? '50%' : '4px',
                                            opacity: item * 0.3,
                                            transform: `scale(${1 - item * 0.1})`
                                        }}/>
                                    ))}
                                </div>

                                {/* 悬浮文字 */}
                                <div style={{
                                    position: 'absolute',
                                    top: '15%',
                                    left: '10%',
                                    transform: 'rotate(-5deg)',
                                    padding: '16px',
                                    border: '1px solid #eee',
                                    background: '#fff',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{fontFamily: 'monospace', color: '#666'}}>AI Analysis</div>
                                    <div style={{fontSize: '24px', fontWeight: 600}}>87%</div>
                                </div>
                            </div>

                            {/* 底部文字说明 */}
                            <div style={{
                                textAlign: 'center',
                                marginTop: '32px',
                                color: '#666'
                            }}>
                                Real-time AI analysis engine with deep learning capabilities
                            </div>
                        </div>
                    </Col>
                </Row>

                <div style={{margin: '120px 0'}}>
                    <Title level={2} style={{
                        textAlign: 'center',
                        marginBottom: '80px',
                        color: '#333',
                        fontWeight: 500
                    }}>
                        Why Choose Our AI Survey Platform
                    </Title>
                    <Row gutter={[48, 48]}>
                        {[
                            {
                                icon: <RobotOutlined/>,
                                title: "AI-Powered Analysis",
                                content: "Our intelligent agents analyze responses in real-time, providing deeper insights than traditional surveys."
                            },
                            {
                                icon: <FormOutlined/>,
                                title: "Dynamic Questionnaires",
                                content: "Create adaptive surveys that change based on previous answers, ensuring relevant data collection."
                            },
                            {
                                icon: <LineChartOutlined/>,
                                title: "Comprehensive Reports",
                                content: "Get detailed reports with visualizations and AI-generated insights from your survey responses."
                            }
                        ].map((item, index) => (
                            <Col xs={24} md={8} key={index}>
                                <Card
                                    hoverable
                                    style={{
                                        height: '100%',
                                        borderRadius: '12px',
                                        border: '1px solid #eee',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
                                    }}
                                    cover={
                                        <div style={{
                                            padding: '48px',
                                            background: '#fff',
                                            textAlign: 'center',
                                            borderBottom: '1px solid #eee'
                                        }}>
                                            {React.cloneElement(item.icon, {
                                                style: {
                                                    fontSize: '48px',
                                                    color: '#333',
                                                    transform: 'scale(1.2)'
                                                }
                                            })}
                                        </div>
                                    }
                                >
                                    <Card.Meta
                                        title={<div style={{fontSize: '20px', fontWeight: 500}}>{item.title}</div>}
                                        description={<div style={{color: '#666', lineHeight: 1.6}}>{item.content}</div>}
                                        style={{padding: '24px'}}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>

            <Footer style={{
                textAlign: 'center',
                background: '#000',
                color: 'rgba(255,255,255,0.8)',
                padding: '48px 24px',
                borderTop: '1px solid #333'
            }}>
                <div style={{maxWidth: '800px', margin: '0 auto'}}>
                    AI Quiz Agent ©{new Date().getFullYear()} — Intelligent Survey Platform
                    <div style={{marginTop: '16px', fontSize: '12px', letterSpacing: '1px'}}>
                        THOUGHTFULLY DESIGNED IN NEW YORK
                    </div>
                </div>
            </Footer>
        </Layout>
    );
};

export default HomePage;