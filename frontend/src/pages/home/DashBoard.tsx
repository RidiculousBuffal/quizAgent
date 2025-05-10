import {Layout, Typography, Avatar, Button} from 'antd';
import {useLogto} from '@logto/react';
import {useUserStore} from '../../store/user/UserStore.ts';
import {UserOutlined, FormOutlined, LineChartOutlined, TeamOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router";
import React, {useState} from 'react';
import MySurveys from '../dashboardPages/MySurveys.tsx';
import QuizAnalysis from '../dashboardPages/QuizAnalysis.tsx';
import ReceivedQuizzes from '../dashboardPages/ReceivedQuizzes.tsx';
import MyAccount from '../dashboardPages/MyAccount.tsx';
import {env} from "../../env.ts";

const {Header, Content, Footer, Sider} = Layout;
const {Title, Text} = Typography;

const Dashboard: React.FC = () => {
    const {signOut} = useLogto();
    const user = useUserStore(state => state.user)!;
    const navigator = useNavigate();
    const [activeTab, setActiveTab] = useState('my-quizzes'); // Default to my quizzes

    const backToHome = () => {
        navigator("/");
    }

    // Function to render the appropriate content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'my-quizzes':
                return <MySurveys/>;
            case 'quiz-analysis':
                return <QuizAnalysis/>;
            case 'received-quizzes':
                return <ReceivedQuizzes/>;
            case 'my-account':
                return <MyAccount/>;
            default:
                return <MySurveys/>;
        }
    };

    return (
        <Layout style={{height: '100vh', overflow: 'hidden'}}>
            {/* 侧边栏 */}
            <Sider
                width={260}
                style={{
                    background: '#fff',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                    height: '100vh',
                    overflow: 'auto'
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
                    <Title level={5}>导航</Title>
                    <Button
                        type={activeTab === 'my-quizzes' ? "primary" : "link"}
                        block
                        style={{textAlign: 'left', height: 'auto', padding: '10px 0'}}
                        onClick={() => setActiveTab('my-quizzes')}
                    >
                        <FormOutlined/> 我的问卷
                    </Button>
                    <Button
                        type={activeTab === 'quiz-analysis' ? "primary" : "link"}
                        block
                        style={{textAlign: 'left', height: 'auto', padding: '10px 0'}}
                        onClick={() => setActiveTab('quiz-analysis')}
                    >
                        <LineChartOutlined/> 问卷分析
                    </Button>
                    <Button
                        type={activeTab === 'received-quizzes' ? "primary" : "link"}
                        block
                        style={{textAlign: 'left', height: 'auto', padding: '10px 0'}}
                        onClick={() => setActiveTab('received-quizzes')}
                    >
                        <TeamOutlined/> 收到的问卷
                    </Button>
                    <Button
                        type={activeTab === 'my-account' ? "primary" : "link"}
                        block
                        style={{textAlign: 'left', height: 'auto', padding: '10px 0'}}
                        onClick={() => setActiveTab('my-account')}
                    >
                        <UserOutlined/> 我的账户
                    </Button>

                    <div style={{marginTop: '30px'}}>
                        <Button
                            danger
                            onClick={() => signOut(env.VITE_APP_URL)}
                            block
                        >
                            退出登录
                        </Button>
                    </div>
                </div>
            </Sider>

            {/* 右侧内容区 */}
            <Layout style={{display: 'flex', flexDirection: 'column'}}>
                {/* 顶部导航 */}
                <Header
                    style={{
                        background: '#fff',
                        padding: '0 24px',
                        height: '64px',
                        borderBottom: '1px solid #f0f0f0',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center', // 垂直居中
                        justifyContent: 'space-between'
                    }}
                >
                    <Title level={3} style={{margin: 0}}>仪表盘</Title>
                    <Button type="text" size="large"
                            style={{fontWeight: 500}} onClick={() => backToHome()}>回到主页</Button>
                </Header>

                <Content style={{
                    padding: '24px 24px 0',
                    background: '#f5f5f5',
                    height: 'calc(100vh - 64px - 70px)', // 100vh减去Header和Footer的高度
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* 动态渲染内容区域 */}
                    {renderContent()}
                </Content>

                {/* 页脚 */}
                <Footer style={{
                    textAlign: 'center',
                    height: '50px',
                    lineHeight: '50px',
                    padding: '0',
                    flexShrink: 0
                }}>
                    Future Quiz ©{new Date().getFullYear()} - Intelligent Survey Platform
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Dashboard;