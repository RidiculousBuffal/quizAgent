import {Layout, Typography, Card, Avatar, Button, Row, Col, Statistic} from 'antd';
import {useLogto} from '@logto/react';
import {useUserStore} from '../../store/user/UserStore.ts';
import {UserOutlined, FormOutlined, LineChartOutlined, TeamOutlined} from '@ant-design/icons';

const {Header, Content, Footer, Sider} = Layout;
const {Title, Text} = Typography;

const Dashboard: React.FC = () => {
    const {signOut} = useLogto();
    const user = useUserStore(state => state.user)!;
    return (
        <Layout style={{minHeight: '100vh'}}>
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
                        icon={!user.userAvatar ? <UserOutlined/> : undefined}
                        style={{marginBottom: '16px'}}
                    />
                    <Title level={4} style={{marginBottom: '4px'}}>{user.userName}</Title>
                    <Text type="secondary">{user.userEmail || 'No email provided'}</Text>
                </div>

                <div style={{padding: '20px'}}>
                    <Title level={5}>Navigation</Title>
                    <Button type="link" block style={{textAlign: 'left', height: 'auto', padding: '10px 0'}}>
                        <FormOutlined/> My Surveys
                    </Button>
                    <Button type="link" block style={{textAlign: 'left', height: 'auto', padding: '10px 0'}}>
                        <LineChartOutlined/> Analytics
                    </Button>
                    <Button type="link" block style={{textAlign: 'left', height: 'auto', padding: '10px 0'}}>
                        <TeamOutlined/> Respondents
                    </Button>
                    <Button type="link" block style={{textAlign: 'left', height: 'auto', padding: '10px 0'}}>
                        <UserOutlined/> Account
                    </Button>

                    <div style={{marginTop: '30px'}}>
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
                    <Title level={3} style={{margin: 0}}>Dashboard</Title>
                </Header>

                <Content style={{padding: '24px', background: '#f5f5f5'}}>
                    <Title level={4}>Welcome back, {user.userName}!</Title>

                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={8}>
                            <Card>
                                <Statistic
                                    title="Surveys Created"
                                    value={0}
                                    prefix={<FormOutlined/>}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card>
                                <Statistic
                                    title="Total Responses"
                                    value={0}
                                    prefix={<TeamOutlined/>}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card>
                                <Statistic
                                    title="Completion Rate"
                                    value={0}
                                    suffix="%"
                                    prefix={<LineChartOutlined/>}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card title="Recent Surveys" style={{marginTop: '24px'}}>
                        <p>You haven't created any surveys yet.</p>
                        <Button type="primary">Create Your First Survey</Button>
                    </Card>
                </Content>

                <Footer style={{textAlign: 'center'}}>
                    AI Quiz Agent ©{new Date().getFullYear()} - Intelligent Survey Platform
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Dashboard;