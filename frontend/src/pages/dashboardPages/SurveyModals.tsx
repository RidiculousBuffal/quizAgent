// src/components/dashboard/SurveyModals.tsx
import React from 'react';

import {FormInstance} from 'antd/es/form';
import QuizInfoEdit, {QuizInfoType} from "../../components/modal/QuizInfoEdit.tsx";
import QuizPublishPermissionModal from "../../components/modal/QuestionPermissionModal.tsx";

export interface QuizShowType {
    quizId: number;
    quizName: string;
    quizDescription: string;
    quizStartTime: string;
    quizEndTime: string;
    status: number;
}

interface SurveyModalsProps {
    // 新建问卷模态框
    quizModalVisible: boolean;
    setQuizModalVisible: (visible: boolean) => void;
    handleNewQuizDesign: () => void;
    formData: FormInstance;

    // 编辑问卷信息模态框
    quizModelEditVisible: boolean;
    setQuizModalEditVisible: (visible: boolean) => void;
    handleEditQuizDesign: () => void;
    formEditData: FormInstance;
    curEditInfoSurvey?: QuizInfoType;

    // 发布权限模态框
    publishModalOpen: boolean;
    setPublishModalOpen: (visible: boolean) => void;
    publishModalQuiz: QuizShowType | null;
    onStatusChange: (newStatus: number) => void;
}

const SurveyModals: React.FC<SurveyModalsProps> = ({
                                                       quizModalVisible,
                                                       setQuizModalVisible,
                                                       handleNewQuizDesign,
                                                       formData,

                                                       quizModelEditVisible,
                                                       setQuizModalEditVisible,
                                                       handleEditQuizDesign,
                                                       formEditData,
                                                       curEditInfoSurvey,

                                                       publishModalOpen,
                                                       setPublishModalOpen,
                                                       publishModalQuiz,
                                                       onStatusChange
                                                   }) => {
    return (
        <>
            {/* 创建问卷模态框 */}
            <QuizInfoEdit
                initialValue={undefined}
                open={quizModalVisible}
                onCancel={() => setQuizModalVisible(false)}
                onOk={handleNewQuizDesign}
                formData={formData}
            />

            {/* 编辑问卷信息模态框 */}
            <QuizInfoEdit
                initialValue={curEditInfoSurvey}
                open={quizModelEditVisible}
                onCancel={() => setQuizModalEditVisible(false)}
                onOk={handleEditQuizDesign}
                formData={formEditData}
            />

            {/* 发布权限模态框 */}
            <QuizPublishPermissionModal
                open={publishModalOpen}
                onCancel={() => setPublishModalOpen(false)}
                quizId={publishModalQuiz?.quizId ?? -1}
                status={publishModalQuiz?.status ?? 0}
                onStatusChange={onStatusChange}
            />
        </>
    );
};

export default SurveyModals;