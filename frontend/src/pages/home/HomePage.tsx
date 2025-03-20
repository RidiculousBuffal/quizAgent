import React from 'react';
import {Layout, Typography, Button, Row, Col, Card, Space} from 'antd';
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
        <Layout className="layout" style={{minHeight: '100vh'}}>
            <Header style={{
                background: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 50px'
            }}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <RobotOutlined style={{fontSize: '24px', marginRight: '10px', color: '#1890ff'}}/>
                    <Title level={3} style={{margin: 0}}>AI Quiz Agent</Title>
                </div>
                <Button size="large" onClick={() => {
                    nav('/dashboard')
                }}>DashBoard</Button>
                <Button
                    type={isAuthenticated && isSignedBackend ? "default" : "primary"}
                    size="large"
                    onClick={() => isAuthenticated ?
                        signOut(import.meta.env.VITE_APP_URL).then(logout) :
                        signIn(`${import.meta.env.VITE_APP_URL}/callback`)}
                >
                    {isAuthenticated && isSignedBackend ? "Sign Out" : "Sign In"}
                </Button>
            </Header>

            <Content style={{padding: '50px', background: '#f0f2f5'}}>
                <Row gutter={[24, 24]} align="middle" justify="center">
                    <Col xs={24} md={12}>
                        <div style={{marginBottom: '40px'}}>
                            <Title style={{fontSize: '48px', marginBottom: '24px'}}>
                                Create Intelligent Surveys with AI
                            </Title>
                            <Paragraph style={{fontSize: '18px', marginBottom: '32px'}}>
                                Design dynamic questionnaires powered by artificial intelligence.
                                Get deeper insights and analytics from your respondents.
                            </Paragraph>
                            <Space size="large">
                                <Button type="primary" size="large" shape="round"
                                        onClick={() => !isAuthenticated &&
                                            signIn(`${import.meta.env.VITE_APP_URL}/callback`)}
                                >
                                    {isAuthenticated ? "Create Survey" : "Get Started"}
                                </Button>
                                <Button size="large" shape="round">Learn More</Button>
                            </Space>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <img
                            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                            alt="AI Survey Platform"
                            style={{width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)'}}
                        />
                    </Col>
                </Row>

                <div style={{margin: '80px 0'}}>
                    <Title level={2} style={{textAlign: 'center', marginBottom: '60px'}}>
                        Why Choose Our AI Survey Platform
                    </Title>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={8}>
                            <Card
                                hoverable
                                style={{height: '100%', borderRadius: '8px'}}
                                cover={
                                    <div style={{padding: '40px', background: '#f9f9ff', textAlign: 'center'}}>
                                        <RobotOutlined style={{fontSize: '64px', color: '#1890ff'}}/>
                                    </div>
                                }
                            >
                                <Card.Meta
                                    title="AI-Powered Analysis"
                                    description="Our intelligent agents analyze responses in real-time, providing deeper insights than traditional surveys."
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                hoverable
                                style={{height: '100%', borderRadius: '8px'}}
                                cover={
                                    <div style={{padding: '40px', background: '#f9f9ff', textAlign: 'center'}}>
                                        <FormOutlined style={{fontSize: '64px', color: '#1890ff'}}/>
                                    </div>
                                }
                            >
                                <Card.Meta
                                    title="Dynamic Questionnaires"
                                    description="Create adaptive surveys that change based on previous answers, ensuring relevant data collection."
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                hoverable
                                style={{height: '100%', borderRadius: '8px'}}
                                cover={
                                    <div style={{padding: '40px', background: '#f9f9ff', textAlign: 'center'}}>
                                        <LineChartOutlined style={{fontSize: '64px', color: '#1890ff'}}/>
                                    </div>
                                }
                            >
                                <Card.Meta
                                    title="Comprehensive Reports"
                                    description="Get detailed reports with visualizations and AI-generated insights from your survey responses."
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>

            <Footer style={{textAlign: 'center', background: '#001529', color: 'white', padding: '24px'}}>
                AI Quiz Agent ©{new Date().getFullYear()} - Intelligent Survey Platform
            </Footer>
        </Layout>
    );
};

export default HomePage;