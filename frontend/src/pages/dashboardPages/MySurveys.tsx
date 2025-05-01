// src/components/dashboard/MySurveys.tsx
import React, {useEffect, useState} from 'react';
import {Typography, message} from 'antd';
import {useForm} from 'antd/es/form/Form';
import {useQuizStore} from '../../store/quiz/QuizStore';
import {createOrEditQuiz, deleteQuizById, getQuizList} from '../../api/quizApi';
import dayjs from 'dayjs';
import {useNavigate} from "react-router";
import {getTotalResponse} from "../../api/quizQuestionAnswerApi";
import {useUserStore} from '../../store/user/UserStore';

// 导入拆分后的组件
import SurveyStatistics from './SurveyStatistics';
import SurveyListCard from './SurveyListCard';
import SurveyModals from './SurveyModals';
import {QuizInfoType} from "../../components/modal/QuizInfoEdit.tsx";


const {Title} = Typography;

export interface QuizShowType {
    quizId: number;
    quizName: string;
    quizDescription: string;
    quizStartTime: string;
    quizEndTime: string;
    status: number;
}

const MySurveys: React.FC = () => {
    const user = useUserStore(state => state.user)!;
    const [quizModalVisible, setQuizModalVisible] = useState(false);
    const [quizModelEditVisible, setQuizModalEditVisible] = useState(false);
    const navigator = useNavigate();
    const [formData] = useForm();
    const [formEditData] = useForm();
    const [surveyData, setSurveyData] = useState<QuizShowType[]>([]);
    const [publishModalOpen, setPublishModalOpen] = useState(false);
    const [publishModalQuiz, setPublishModalQuiz] = useState<QuizShowType | null>(null);
    const [totalResponse, setTotalResponse] = useState<number | null>(0);

    const [curEditInfoSurvey, setCurEditInfoSurvey] = useState<QuizInfoType>();
    const [curEditSurveyId, setCurEditSurveyId] = useState<number>(-1);
    const setCurEditQuizId = useQuizStore(state => state.setCurEditQuizId);

    // 加载问卷列表
    useEffect(() => {
        const getCurQuizList = async () => {
            const data = await getQuizList();
            setSurveyData(data as QuizShowType[]);
        }
        getCurQuizList();
    }, []);

    // 加载总回复数
    useEffect(() => {
        const getNumOfResponse = async () => {
            const data = await getTotalResponse();
            setTotalResponse(data);
        }
        getNumOfResponse();
    }, []);

    // 打开发布权限模态框
    const handleOpenPublishPermission = (record: QuizShowType) => {
        setPublishModalQuiz(record);
        setPublishModalOpen(true);
    }

    // 创建新问卷
    const createNewQuizDesign = () => {
        setQuizModalVisible(true);
    }

    // 处理新问卷创建
    const handleNewQuizDesign = async () => {
        const values = formData.getFieldsValue();
        const startTime = values.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss') || '';
        const endTime = values.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss') || '';

        try {
            const res = await createOrEditQuiz(
                values.title,
                values.description,
                startTime || null,
                endTime || null
            );

            setQuizModalVisible(false);
            setCurEditQuizId((res as { quizId: number }).quizId);
            navigator("/quizDesign");
        } catch (error) {
            console.error('创建问卷失败:', error);
            message.error('创建问卷失败');
        }
    }

    // 编辑问卷
    const editSurveyById = (quizId: number) => {
        setCurEditQuizId(quizId);
        navigator("/quizDesign");
    }

    // 删除问卷
    const deleteSurveyById = async (quizId: number) => {
        try {
            await deleteQuizById(quizId);
            const data = await getQuizList();
            setSurveyData(data as QuizShowType[]);
            message.success('删除成功');
        } catch (error) {
            console.error('删除问卷失败:', error);
            message.error('删除问卷失败');
        }
    }

    // 修改问卷信息
    const changeSurveyInfo = (record: QuizShowType) => {
        const initialValue: QuizInfoType = {
            title: record.quizName,
            description: record.quizDescription,
            timeRange: record.quizStartTime && record.quizEndTime ? [
                dayjs(record.quizStartTime, 'YYYY-MM-DD HH:mm:ss'),
                dayjs(record.quizEndTime, 'YYYY-MM-DD HH:mm:ss'),
            ] : undefined
        };

        setCurEditInfoSurvey(initialValue);
        setCurEditSurveyId(record.quizId);
        formEditData.setFieldsValue(initialValue);
        setQuizModalEditVisible(true);
    }

    // 处理编辑问卷
    const handleEditQuizDesign = async () => {
        const values = formEditData.getFieldsValue();
        const startTime = values.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss') || null;
        const endTime = values.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss') || null;

        try {
            await createOrEditQuiz(
                values.title,
                values.description,
                startTime,
                endTime,
                curEditSurveyId
            );

            setQuizModalEditVisible(false);
            message.success('修改成功');

            // 更新问卷列表
            const data = await getQuizList();
            setSurveyData(data as QuizShowType[]);
        } catch (error) {
            console.error('修改问卷信息失败:', error);
            message.error('修改问卷信息失败');
        }
    }

    // 处理状态更改
    const handleStatusChange = async (newStatus: number) => {
        if (!publishModalQuiz) return;

        setPublishModalQuiz({...publishModalQuiz, status: newStatus});
        // 更新主表
        const data = await getQuizList();
        setSurveyData(data as QuizShowType[]);
    };

    return (
        <>
            {/* 模态框 */}
            <SurveyModals
                quizModalVisible={quizModalVisible}
                setQuizModalVisible={setQuizModalVisible}
                handleNewQuizDesign={handleNewQuizDesign}
                formData={formData}

                quizModelEditVisible={quizModelEditVisible}
                setQuizModalEditVisible={setQuizModalEditVisible}
                handleEditQuizDesign={handleEditQuizDesign}
                formEditData={formEditData}
                curEditInfoSurvey={curEditInfoSurvey}

                publishModalOpen={publishModalOpen}
                setPublishModalOpen={setPublishModalOpen}
                publishModalQuiz={publishModalQuiz}
                onStatusChange={handleStatusChange}
            />

            {/* 欢迎标题 */}
            <div style={{marginBottom: '24px', flexShrink: 0}}>
                <Title level={4} style={{margin: 0}}>欢迎回来, {user.userName}!</Title>
            </div>

            {/* 统计卡片区 */}
            <SurveyStatistics
                surveyCount={surveyData.length}
                totalResponses={totalResponse}
            />

            {/* 问卷列表区 */}
            <div style={{
                flex: '1',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <SurveyListCard
                    surveyData={surveyData}
                    onCreateNewQuiz={createNewQuizDesign}
                    onChangeInfo={changeSurveyInfo}
                    onEdit={editSurveyById}
                    onDelete={deleteSurveyById}
                    onPublishPermission={handleOpenPublishPermission}
                />
            </div>
        </>
    );
};

export default MySurveys;