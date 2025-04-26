import { Layout, Typography, Card, Avatar, Button, Row, Col, Statistic, message } from 'antd';
import { useLogto } from '@logto/react';
import { useUserStore } from '../../store/user/UserStore.ts';
import { UserOutlined, FormOutlined, LineChartOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router";
import { useEffect, useState } from 'react';
import QuizInfoEdit, { QuizInfoType } from '../../components/modal/QuizInfoEdit.tsx';
import { useForm } from 'antd/es/form/Form';
import { useQuizStore } from '../../store/quiz/QuizStore.ts';
import { createOrEditQuiz, deleteQuizById, getQuizList } from '../../api/quizApi.ts';
import QuizTable from '../../components/table/QuizTable.tsx';
import dayjs from 'dayjs';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

export interface quizShowType {
    quizId: number,
    quizName: string,
    quizDescription: string,
    quizStartTime: string,
    quizEndTime: string,
    status: number
}

const Dashboard: React.FC = () => {
    const { signOut } = useLogto();
    const user = useUserStore(state => state.user)!;
    const [quizModalVisible, setQuizModalVisible] = useState(false);
    const [quizModelEditVisible, setQuizModalEditVisible] = useState(false)
    const navigator = useNavigate();
    const [formData] = useForm()
    const [formEditData] = useForm()
    const [surveyData, setSurveyData] = useState<quizShowType[]>([])
    const [curEditInfoSurvey, setCurEditInfoSurvey] = useState<QuizInfoType>()
    const [curEditSurveyId, setCurEditSurveyId] = useState<number>(-1)
    const createNewQuizDesign = () => {
        setQuizModalVisible(true);
    }
    const setCurEditQuizId = useQuizStore(state => state.setCurEditQuizId)

    const handleNewQuizDesign = async () => {
        if (formData.getFieldsValue().timeRange) {
            await createOrEditQuiz(formData.getFieldsValue().title,
                formData.getFieldsValue().description,
                formData.getFieldsValue().timeRange[0]?.format('YYYY-MM-DD HH:mm:ss'),
                formData.getFieldsValue().timeRange[1]?.format('YYYY-MM-DD HH:mm:ss')).then(res => {
                    setQuizModalVisible(false);
                    setCurEditQuizId((res as { quizId: number }).quizId)
                    navigator("/quizDesign")
                })
        } else {
            await createOrEditQuiz(formData.getFieldsValue().title,
                formData.getFieldsValue().description,
                '', '').then(res => {
                    setQuizModalVisible(false);
                    setCurEditQuizId((res as { quizId: number }).quizId)
                    navigator("/quizDesign")
                })
        }
    }

    useEffect(() => {
        const getCurQuizList = async () => {
            const data = await getQuizList()
            setSurveyData(data as quizShowType[])
        }
        getCurQuizList()
    }, [])

    const editSurveyById = (quizId: number) => {
        setCurEditQuizId(quizId)
        navigator("/quizDesign")
    }

    const deleteSurveyById = async (quizId: number) => {
        await deleteQuizById(quizId)
        const data = await getQuizList()
        setSurveyData(data as quizShowType[])
    }

    const changeSurveyInfo = (record: quizShowType) => {

        const initialValue: QuizInfoType = {
            title: record.quizName,
            description: record.quizDescription,
            timeRange: [
                dayjs(record.quizStartTime, 'YYYY-MM-DD HH:mm:ss'),
                dayjs(record.quizEndTime, 'YYYY-MM-DD HH:mm:ss'),
            ]
        }
        setCurEditInfoSurvey(initialValue)
        setCurEditSurveyId(record.quizId)
        formEditData.setFieldsValue(initialValue)
        setQuizModalEditVisible(true)
    }

    const handleEditQuizDesign = async () => {
        if (formEditData.getFieldsValue().timeRange) {
            await createOrEditQuiz(formEditData.getFieldsValue().title,
                formEditData.getFieldsValue().description,
                formEditData.getFieldsValue().timeRange[0]?.format('YYYY-MM-DD HH:mm:ss'),
                formEditData.getFieldsValue().timeRange[1]?.format('YYYY-MM-DD HH:mm:ss'),
                curEditSurveyId
            ).then(async res => {
                setQuizModalEditVisible(false);
                if (res!.quizId === curEditSurveyId)
                    message.success('修改成功')
                const data = await getQuizList()
                setSurveyData(data as quizShowType[])
            })
        } else {
            await createOrEditQuiz(formEditData.getFieldsValue().title,
                formEditData.getFieldsValue().description,
                null, null, curEditSurveyId).then(async res => {
                    setQuizModalEditVisible(false);
                    if (res!.quizId === curEditSurveyId)
                        message.success('修改成功')
                    const data = await getQuizList()
                    setSurveyData(data as quizShowType[])
                })
        }
    }

    return (
        <>
            <QuizInfoEdit
                initialValue={undefined}
                open={quizModalVisible}
                onCancel={() => setQuizModalVisible(false)}
                onOk={() => handleNewQuizDesign()}
                formData={formData}
            />
            <QuizInfoEdit
                initialValue={curEditInfoSurvey}
                open={quizModelEditVisible}
                onCancel={() => setQuizModalEditVisible(false)}
                onOk={() => handleEditQuizDesign()}
                formData={formEditData}
            />

            {/* 主布局 - 100vh高度固定，内部各元素高度相对调整 */}
            <Layout style={{ height: '100vh', overflow: 'hidden' }}>
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
                            icon={!user.userAvatar ? <UserOutlined /> : undefined}
                            style={{ marginBottom: '16px' }}
                        />
                        <Title level={4} style={{ marginBottom: '4px' }}>{user.userName}</Title>
                        <Text type="secondary">{user.userEmail || 'No email provided'}</Text>
                    </div>

                    <div style={{ padding: '20px' }}>
                        <Title level={5}>导航</Title>
                        <Button type="link" block style={{ textAlign: 'left', height: 'auto', padding: '10px 0' }}>
                            <FormOutlined /> 我的问卷
                        </Button>
                        <Button type="link" block style={{ textAlign: 'left', height: 'auto', padding: '10px 0' }}>
                            <LineChartOutlined /> 问卷分析
                        </Button>
                        <Button type="link" block style={{ textAlign: 'left', height: 'auto', padding: '10px 0' }}>
                            <TeamOutlined /> 收到的问卷
                        </Button>
                        <Button type="link" block style={{ textAlign: 'left', height: 'auto', padding: '10px 0' }}>
                            <UserOutlined /> 我的账户
                        </Button>

                        <div style={{ marginTop: '30px' }}>
                            <Button
                                danger
                                onClick={() => signOut(import.meta.env.VITE_APP_URL)}
                                block
                            >
                                退出登录
                            </Button>
                        </div>
                    </div>
                </Sider>

                {/* 右侧内容区 */}
                <Layout style={{ display: 'flex', flexDirection: 'column' }}>
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
                        }}
                    >
                        <Title level={3} style={{ margin: 0 }}>仪表盘</Title>
                    </Header>

                    <Content style={{
                        padding: '24px 24px 0',
                        background: '#f5f5f5',
                        height: 'calc(100vh - 64px - 70px)', // 100vh减去Header和Footer的高度
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* 欢迎区 */}
                        <div style={{ marginBottom: '24px', flexShrink: 0 }}>
                            <Title level={4} style={{ margin: 0 }}>欢迎回来, {user.userName}!</Title>
                        </div>

                        {/* 统计卡片区 - 固定高度不滚动 */}
                        <Row gutter={[24, 24]} style={{ marginBottom: '24px', flexShrink: 0 }}>
                            <Col xs={24} md={8}>
                                <Card>
                                    <Statistic
                                        title="已创建问卷数量"
                                        value={surveyData.length}
                                        prefix={<FormOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} md={8}>
                                <Card>
                                    <Statistic
                                        title="得到的总回复"
                                        value={0}
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

                        {/* 表格卡片区 - 占据剩余空间并内部滚动 */}
                        <div style={{
                            flex: '1',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Card
                                title="最近的问卷"
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden'
                                }}
                                styles={{
                                    body: {
                                        flex: 1,
                                        padding: '24px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden'
                                    }
                                }}
                                extra={
                                    <Button
                                        type="primary"
                                        onClick={createNewQuizDesign}
                                    >
                                        创建我的问卷
                                    </Button>
                                }
                            >
                                {/* 表格区域 - 表格内部处理滚动 */}
                                <div style={{
                                    flex: 1,
                                    overflow: 'hidden', // 从auto改为hidden，由Table处理滚动
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    {surveyData.length === 0 ? (
                                        <p>你还没有创建任何问卷.</p>
                                    ) : (
                                        <QuizTable
                                            surveyData={surveyData}
                                            onChangeInfo={changeSurveyInfo}
                                            onEdit={editSurveyById}
                                            onDelete={deleteSurveyById}
                                        />
                                    )}
                                </div>
                            </Card>
                        </div>
                    </Content>

                    {/* 页脚 */}
                    <Footer style={{
                        textAlign: 'center',
                        height: '50px',
                        lineHeight: '50px',
                        padding: '0',
                        flexShrink: 0
                    }}>
                        AI Quiz Agent ©{new Date().getFullYear()} - Intelligent Survey Platform
                    </Footer>
                </Layout>
            </Layout>
        </>
    );
};

export default Dashboard;