import { Layout, Typography, Card, Avatar, Button, Row, Col, Statistic } from 'antd';
import { useLogto } from '@logto/react';
import { useUserStore } from '../../store/user/UserStore.ts';
import { UserOutlined, FormOutlined, LineChartOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router";
import { useState } from 'react';
import NewQuizCreate from '../../components/modal/NewQuizCreate.tsx';
import { useForm } from 'antd/es/form/Form';
import { useQuizStore } from '../../store/quiz/QuizStore.ts';
import { createQuiz } from '../../api/quizApi.ts';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
    const { signOut } = useLogto();
    const user = useUserStore(state => state.user)!;
    const [newQuizModalVisible, setNewQuizModalVisible] = useState(false);
    const navigator = useNavigate();
    const [formData] = useForm()
    const createNewQuizDesign = () => {
        setNewQuizModalVisible(true);
    }
    const setCurEditQuizId = useQuizStore(state => state.setCurEditQuizId)

    const handleNewQuizDesign = async () => {
        await createQuiz(formData.getFieldsValue().title,
            formData.getFieldsValue().description,
            formData.getFieldsValue().timeRange[0]?.format('YYYY-MM-DD HH:mm:ss'),
            formData.getFieldsValue().timeRange[1]?.format('YYYY-MM-DD HH:mm:ss')).then(res => {
                setNewQuizModalVisible(false);
                setCurEditQuizId((res as { quizId: number }).quizId)
                navigator("/quizDesign")
            })
    }

    return (
        <>
            <NewQuizCreate
                open={newQuizModalVisible}
                onCancel={() => setNewQuizModalVisible(false)}
                onOk={() => handleNewQuizDesign()}
                formData={formData}
            />
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    width={260}
                    style={{
                        background: '#fff',
                        boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
                    }}
                >
                    <div style={{
                        padding: '20px',
                        textAlign: 'center',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <Avatar
                            size={80}
                            src={user.userAvatar}
                            icon={!user.userAvatar ? <UserOutlined /> : undefined}
                            style={{ marginBottom: '16px' }}
                        />
                        <Title level={4} style={{ marginBottom: '4px' }}>{user.userName}</Title>
                        <Text type="secondary">{user.userEmail || 'No email provided'}</Text>
                    </div>

                    <div style={{ padding: '20px' }}>
                        <Title level={5}>Navigation</Title>
                        <Button type="link" block style={{ textAlign: 'left', height: 'auto', padding: '10px 0' }}>
                            <FormOutlined /> My Surveys
                        </Button>
                        <Button type="link" block style={{ textAlign: 'left', height: 'auto', padding: '10px 0' }}>
                            <LineChartOutlined /> Analytics
                        </Button>
                        <Button type="link" block style={{ textAlign: 'left', height: 'auto', padding: '10px 0' }}>
                            <TeamOutlined /> Respondents
                        </Button>
                        <Button type="link" block style={{ textAlign: 'left', height: 'auto', padding: '10px 0' }}>
                            <UserOutlined /> Account
                        </Button>

                        <div style={{ marginTop: '30px' }}>
                            <Button
                                danger
                                onClick={() => signOut(import.meta.env.VITE_APP_URL)}
                                block
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </Sider>

                <Layout>
                    <Header style={{
                        background: '#fff',
                        padding: '0 24px',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Title level={3} style={{ margin: 0 }}>Dashboard</Title>
                    </Header>

                    <Content style={{ padding: '24px', background: '#f5f5f5' }}>
                        <Title level={4}>Welcome back, {user.userName}!</Title>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={8}>
                                <Card>
                                    <Statistic
                                        title="Surveys Created"
                                        value={0}
                                        prefix={<FormOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} md={8}>
                                <Card>
                                    <Statistic
                                        title="Total Responses"
                                        value={0}
                                        prefix={<TeamOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} md={8}>
                                <Card>
                                    <Statistic
                                        title="Completion Rate"
                                        value={0}
                                        suffix="%"
                                        prefix={<LineChartOutlined />}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Recent Surveys" style={{ marginTop: '24px' }}>
                            <p>You haven't created any surveys yet.</p>
                            <Button type="primary" onClick={createNewQuizDesign}>Create Your First Survey</Button>
                        </Card>
                    </Content>

                    <Footer style={{ textAlign: 'center' }}>
                        AI Quiz Agent ©{new Date().getFullYear()} - Intelligent Survey Platform
                    </Footer>
                </Layout>
            </Layout>
        </>

    );
};

export default Dashboard;