import React, { useEffect, useState } from 'react';
import { Typography, Card, Button, Row, Col, Statistic, message } from 'antd';
import { FormOutlined, LineChartOutlined, TeamOutlined } from '@ant-design/icons';
import QuizTable from '../../components/table/QuizTable.tsx';
import QuizInfoEdit, { QuizInfoType } from '../../components/modal/QuizInfoEdit.tsx';
import { useForm } from 'antd/es/form/Form';
import { useQuizStore } from '../../store/quiz/QuizStore.ts';
import { createOrEditQuiz, deleteQuizById, getQuizList } from '../../api/quizApi.ts';
import dayjs from 'dayjs';
import { useNavigate } from "react-router";
import QuizPublishPermissionModal from "../../components/modal/QuestionPermissionModal.tsx";
import { getTotalResponse } from "../../api/quizQuestionAnswerApi.ts";
import { useUserStore } from '../../store/user/UserStore.ts';

const { Title } = Typography;

export interface quizShowType {
    quizId: number,
    quizName: string,
    quizDescription: string,
    quizStartTime: string,
    quizEndTime: string,
    status: number
}

const MySurveys: React.FC = () => {
    const user = useUserStore(state => state.user)!;
    const [quizModalVisible, setQuizModalVisible] = useState(false);
    const [quizModelEditVisible, setQuizModalEditVisible] = useState(false);
    const navigator = useNavigate();
    const [formData] = useForm();
    const [formEditData] = useForm();
    const [surveyData, setSurveyData] = useState<quizShowType[]>([]);
    const [publishModalOpen, setPublishModalOpen] = useState(false);
    const [publishModalQuiz, setPublishModalQuiz] = useState<quizShowType | null>(null);
    const [totalResponse, setTotalResponse] = useState<number | null>(0);

    const [curEditInfoSurvey, setCurEditInfoSurvey] = useState<QuizInfoType>();
    const [curEditSurveyId, setCurEditSurveyId] = useState<number>(-1);
    const setCurEditQuizId = useQuizStore(state => state.setCurEditQuizId);

    const handleOpenPublishPermission = (record: quizShowType) => {
        setPublishModalQuiz(record);
        setPublishModalOpen(true);
    }

    const createNewQuizDesign = () => {
        setQuizModalVisible(true);
    }

    const handleNewQuizDesign = async () => {
        if (formData.getFieldsValue().timeRange) {
            await createOrEditQuiz(
                formData.getFieldsValue().title,
                formData.getFieldsValue().description,
                formData.getFieldsValue().timeRange[0]?.format('YYYY-MM-DD HH:mm:ss'),
                formData.getFieldsValue().timeRange[1]?.format('YYYY-MM-DD HH:mm:ss')
            ).then(res => {
                setQuizModalVisible(false);
                setCurEditQuizId((res as { quizId: number }).quizId);
                navigator("/quizDesign");
            });
        } else {
            await createOrEditQuiz(
                formData.getFieldsValue().title,
                formData.getFieldsValue().description,
                '', ''
            ).then(res => {
                setQuizModalVisible(false);
                setCurEditQuizId((res as { quizId: number }).quizId);
                navigator("/quizDesign");
            });
        }
    }

    useEffect(() => {
        const getCurQuizList = async () => {
            const data = await getQuizList();
            setSurveyData(data as quizShowType[]);
        }
        getCurQuizList();
    }, []);

    useEffect(() => {
        const getNumOfResponse = async () => {
            const data = await getTotalResponse();
            setTotalResponse(data);
        }
        getNumOfResponse();
    }, []);

    const editSurveyById = (quizId: number) => {
        setCurEditQuizId(quizId);
        navigator("/quizDesign");
    }

    const deleteSurveyById = async (quizId: number) => {
        await deleteQuizById(quizId);
        const data = await getQuizList();
        setSurveyData(data as quizShowType[]);
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
        setCurEditInfoSurvey(initialValue);
        setCurEditSurveyId(record.quizId);
        formEditData.setFieldsValue(initialValue);
        setQuizModalEditVisible(true);
    }

    const handleEditQuizDesign = async () => {
        if (formEditData.getFieldsValue().timeRange) {
            await createOrEditQuiz(
                formEditData.getFieldsValue().title,
                formEditData.getFieldsValue().description,
                formEditData.getFieldsValue().timeRange[0]?.format('YYYY-MM-DD HH:mm:ss'),
                formEditData.getFieldsValue().timeRange[1]?.format('YYYY-MM-DD HH:mm:ss'),
                curEditSurveyId
            ).then(async res => {
                setQuizModalEditVisible(false);
                if (res!.quizId === curEditSurveyId)
                    message.success('修改成功');
                const data = await getQuizList();
                setSurveyData(data as quizShowType[]);
            });
        } else {
            await createOrEditQuiz(
                formEditData.getFieldsValue().title,
                formEditData.getFieldsValue().description,
                null, null, curEditSurveyId
            ).then(async res => {
                setQuizModalEditVisible(false);
                if (res!.quizId === curEditSurveyId)
                    message.success('修改成功');
                const data = await getQuizList();
                setSurveyData(data as quizShowType[]);
            });
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

            <div style={{marginBottom: '24px', flexShrink: 0}}>
                <Title level={4} style={{margin: 0}}>欢迎回来, {user.userName}!</Title>
            </div>

            {/* 统计卡片区 */}
            <Row gutter={[24, 24]} style={{marginBottom: '24px', flexShrink: 0}}>
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title="已创建问卷数量"
                            value={surveyData.length}
                            prefix={<FormOutlined/>}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title="得到的总回复"
                            value={totalResponse ?? 0}
                            prefix={<TeamOutlined/>}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title="问卷完成率"
                            value={0}
                            suffix="%"
                            prefix={<LineChartOutlined/>}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 表格卡片区 */}
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
                    <div style={{
                        flex: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {surveyData.length === 0 ? (
                            <p>你还没有创建任何问卷.</p>
                        ) : (
                            <>
                                <QuizTable
                                    surveyData={surveyData}
                                    onChangeInfo={changeSurveyInfo}
                                    onEdit={editSurveyById}
                                    onDelete={deleteSurveyById}
                                    onPublishPermission={handleOpenPublishPermission}
                                />
                                <QuizPublishPermissionModal
                                    open={publishModalOpen}
                                    onCancel={() => setPublishModalOpen(false)}
                                    quizId={publishModalQuiz?.quizId ?? -1}
                                    status={publishModalQuiz?.status ?? 0}
                                    onStatusChange={async (newStatus: number) => {
                                        if (!publishModalQuiz) return;
                                        setPublishModalQuiz({...publishModalQuiz, status: newStatus});
                                        // 更新主表
                                        const data = await getQuizList();
                                        setSurveyData(data as quizShowType[]);
                                    }}
                                />
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </>
    );
};

export default MySurveys;