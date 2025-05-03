// MainDesign.tsx
import React, {useEffect, useState, useCallback} from 'react';
import {v4 as uuid} from 'uuid';
import {
    Layout,
    Button,
    Divider,
    Empty,
    Typography,
    message,
    Spin,
    Segmented,
} from 'antd';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    SaveOutlined,
    EditOutlined,
    CheckCircleOutlined,
    CheckSquareOutlined,
    CheckOutlined,
    LoadingOutlined,
    EyeOutlined,
    RobotOutlined,
} from '@ant-design/icons';
import {useQuestionStore} from '../../store/question/QuestionStore';
import QuestionTypeList from './QuestionTypeList';
import SortableQuestionCard from './SortableQuestionCard';
import QuestionEditWrapper from '../../lib/Questions/QuestionWarpper/QuestionEditWrapper';
import QuestionViewWrapper from '../../lib/Questions/QuestionWarpper/QuestionPreviewWrapper.tsx';
import {QuestionFactory} from '../../lib/Questions/QuestionFactory';
import {QuestionType} from '../../lib/Questions/QuestionType';
import {
    deleteQuestionBackend,
    getAllQuestionsInQuiz,
    saveAllQuestions,
} from '../../api/questionapi.ts';
import {useQuizStore} from '../../store/quiz/QuizStore.ts';
import {ArrowLeft} from 'lucide-react';
import {useNavigate} from 'react-router';
import AIAssistant from '../../components/AIAssistant/AIAssistant.tsx';

const {Header, Sider, Content} = Layout;
const {Title, Text} = Typography;

/* ------------ 题型配置 ------------ */
const questionTypes: {
    key: string;
    icon: React.ReactNode;
    title: string;
    type: QuestionType;
}[] = [
    {
        key: 'single',
        icon: <CheckCircleOutlined/>,
        title: '单选题',
        type: {typeId: 1, typeName: 'radio', typeDescription: '单选题'},
    },
    {
        key: 'multi',
        icon: <CheckSquareOutlined/>,
        title: '多选题',
        type: {typeId: 2, typeName: 'checkbox', typeDescription: '多选题'},
    },
    {
        key: 'input',
        icon: <EditOutlined/>,
        title: '填空题',
        type: {typeId: 3, typeName: 'fillblank', typeDescription: '填空题'},
    },
    {
        key: 'essay',
        icon: <EditOutlined/>,
        title: '简答题',
        type: {typeId: 4, typeName: 'essay', typeDescription: '简答题'},
    }
];

/* ====================================================================== */
/*                          组件主体 MainDesign                           */
/* ====================================================================== */
const MainDesign: React.FC = () => {
    /* ----------------- 本地 UI 状态 ----------------- */
    const [activeId, setActiveId] = useState<number | null>(null);
    const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [showAIAssistant, setShowAIAssistant] = useState(false);

    /* ----------------- store 交互 ----------------- */
    const questionAnswer = useQuestionStore((s) => s.questionAnswer);
    const setQuestion = useQuestionStore((q) => q.setRawQuestions);
    const addQuestion = useQuestionStore((s) => s.addQuestion);
    const deleteQuestion = useQuestionStore((s) => s.deleteQuestion);
    const sortQuestions = useQuestionStore((s) => s.sortQuestions);
    const questions = questionAnswer.map((qa) => qa.question);

    const currentQuizId = useQuizStore((q) => q.curEditQuizId);

    /* ----------------- 其它 hooks ----------------- */
    const nav = useNavigate();
    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates}),
    );

    /* ====================== 初始化载入 ====================== */
    useEffect(() => {
        if (!currentQuizId) return;
        getAllQuestionsInQuiz(currentQuizId).then((r) => {
            if (r) setQuestion(r);
        });
    }, [currentQuizId, setQuestion]);

    /* ==================== 保存状态监控 ===================== */
    useEffect(() => {
        /* 任意 questionAnswer 或其长度变化均视为脏 */
        if (questions.length) setHasUnsavedChanges(true);
    }, [questionAnswer, questions.length]);

    /* ========================= 保存 ========================= */
    const saveQuestions = useCallback(async () => {
        if (!hasUnsavedChanges) return;
        try {
            setSavingStatus('saving');
            setIsSaving(true);
            await saveAllQuestions();
            setSavingStatus('saved');
            setHasUnsavedChanges(false);
            setTimeout(() => setSavingStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setSavingStatus('error');
            message.error('保存问卷失败，请稍后重试');
        } finally {
            setIsSaving(false);
        }
    }, [hasUnsavedChanges]);

    /* 自动保存，每 5 秒轮询一次 */
    useEffect(() => {
        const timer = setInterval(() => {
            if (hasUnsavedChanges && savingStatus !== 'saving') saveQuestions();
        }, 5000);
        return () => clearInterval(timer);
    }, [hasUnsavedChanges, savingStatus, saveQuestions]);

    /* ================== 题目增删改排 ================== */
    const handleAddQuestion = (type: QuestionType) => {
        console.log(type)
        const id = Date.now();
        const params: any = {
            id,
            title: `新建${type.typeDescription}`,
            sort: id,
        };

        switch (type.typeName) {
            case 'fillblank':
                Object.assign(params, {
                    blankCount: 1,
                    blankLabels: ['填空 1'],
                    answerType: 'text',
                    correctAnswers: [[]],
                    inlineMode: false,
                    isRequired: false,
                });
                break;
            case 'checkbox':
                Object.assign(params, {
                    options: [
                        {key: uuid(), text: '选项 1', value: uuid()},
                    ],
                    isRequired: false,
                    randomizeOptions: false,
                    displayInColumns: 1,
                    exclusiveOptions: [],
                    allowOther: false,
                    otherText: '',
                });
                break;
            case 'radio':
                Object.assign(params, {
                    options: [
                        {key: uuid(), text: '选项 1', value: uuid()},
                    ],
                    isRequired: false,
                    allowOther: false,
                    otherText: '',
                });
                break;
            case 'essay':
                Object.assign(params, {
                    placeholder: '',
                    allowMarkdown: true,
                    hideWordCount: false
                })
                break;
        }

        const newQuestion = QuestionFactory.createQuestion(type, params);
        addQuestion(newQuestion);
        setActiveId(newQuestion.id);
    };

    /* 拖拽排序 */
    const handleDragEnd = ({active, over}: DragEndEvent) => {
        if (over && active.id !== over.id) {
            sortQuestions(Number(active.id), Number(over.id));
        }
    };

    /* 其它操作 */
    const handleDelete = (id: number) => {
        deleteQuestion(id);
        deleteQuestionBackend(id).catch((e) => console.error(e));
        setActiveId((prev) => (prev === id ? null : prev));
    };

    const handleDuplicate = (id: number) => {
        const q = questions.find((qq) => qq.id === id);
        if (!q) return;
        const newId = Date.now();
        const copy = q.clone
            ? q.clone()
            : QuestionFactory.createQuestion(q.type, {
                ...q,
                id: newId,
                title: q.title + ' (副本)',
            });
        addQuestion(copy);
        setActiveId(newId);
    };

    const handleMoveUp = (id: number) => {
        const idx = questions.findIndex((q) => q.id === id);
        if (idx > 0) sortQuestions(id, questions[idx - 1].id);
    };

    const handleMoveDown = (id: number) => {
        const idx = questions.findIndex((q) => q.id === id);
        if (idx < questions.length - 1) sortQuestions(id, questions[idx + 1].id);
    };

    /* ================== 渲染保存状态 ================== */
    const renderSaveStatus = () => {
        switch (savingStatus) {
            case 'saving':
                return (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Spin indicator={<LoadingOutlined style={{fontSize: 18}} spin/>}/>
                        <Text type="secondary" style={{marginLeft: 8}}>
                            问卷保存中...
                        </Text>
                    </div>
                );
            case 'saved':
                return (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <CheckOutlined style={{color: '#52c41a', fontSize: 16}}/>
                        <Text type="success" style={{marginLeft: 8}}>
                            已保存
                        </Text>
                    </div>
                );
            case 'error':
                return (
                    <Text type="danger" style={{fontWeight: 'bold'}}>
                        保存失败，请手动保存
                    </Text>
                );
            default:
                return hasUnsavedChanges ? (
                    <Text type="warning" style={{fontWeight: 'bold'}}>
                        有未保存的更改
                    </Text>
                ) : null;
        }
    };

    /* ========================= JSX ========================= */
    return (
        <Layout style={{maxHeight: '100vh', minHeight: '100vh'}}>
            {/* 顶部栏 */}
            <Header style={{background: '#fff', padding: '0 16px', borderBottom: '1px solid #f0f0f0'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Title level={4} style={{margin: 0, marginRight: 16}}>
                            问卷设计
                        </Title>
                        <Segmented
                            options={[
                                {value: 'edit', label: (<><EditOutlined/> 编辑模式</>)},
                                {value: 'preview', label: (<><EyeOutlined/> 预览模式</>)},
                            ]}
                            value={mode}
                            onChange={(v) => setMode(v as 'edit' | 'preview')}
                            style={{marginRight: 16}}
                        />
                        {renderSaveStatus()}
                    </div>

                    <div style={{display: 'flex', gap: 10}}>
                        <Button
                            icon={<RobotOutlined/>}
                            type={showAIAssistant ? 'primary' : 'default'}
                            onClick={() => setShowAIAssistant(!showAIAssistant)}
                        >
                            AI助手
                        </Button>
                        <Button icon={<ArrowLeft/>} onClick={() => nav('/dashboard')}>
                            返回
                        </Button>
                        <Button
                            icon={<SaveOutlined/>}
                            type="primary"
                            onClick={saveQuestions}
                            loading={isSaving}
                            disabled={savingStatus === 'saving' || !hasUnsavedChanges}
                        >
                            {isSaving ? '保存中...' : '保存问卷'}
                        </Button>
                    </div>
                </div>
            </Header>

            {/* 主体布局 */}
            <Layout style={{position: 'relative', height: 'calc(100vh - 64px)'}}>
                {/* 左侧：题型+题目列表 */}
                <Sider width="20%" style={{background: '#fff', padding: 16, overflowY: 'auto'}}>
                    <QuestionTypeList questionTypes={questionTypes} onAddQuestion={handleAddQuestion}/>
                    <Divider/>
                    <Title level={5}>题目列表</Title>

                    {questions.length === 0 ? (
                        <Empty description="暂无题目"/>
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
                                {questions.map((q, i) => (
                                    <SortableQuestionCard
                                        key={q.id}
                                        question={q}
                                        index={i}
                                        questionLength={questions.length}
                                        isActive={activeId === q.id}
                                        onSelect={() => setActiveId(q.id)}
                                        onDelete={() => handleDelete(q.id)}
                                        onDuplicate={() => handleDuplicate(q.id)}
                                        onMoveUp={() => handleMoveUp(q.id)}
                                        onMoveDown={() => handleMoveDown(q.id)}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}
                </Sider>

                {/* 中间：编辑/预览 */}
                <Content
                    style={{
                        padding: 20,
                        background: '#f5f5f5',
                        overflowY: 'auto',
                        marginRight: showAIAssistant ? 360 : 0,
                        transition: 'margin-right .3s',
                    }}
                >
                    {activeId && questions.find((q) => q.id === activeId) ? (
                        mode === 'edit' ? <QuestionEditWrapper id={activeId}/> : <QuestionViewWrapper id={activeId}/>
                    ) : (
                        <Empty description="请从左侧添加或选择题目进行编辑" style={{marginTop: 100}}/>
                    )}
                </Content>

                {/* 右侧 AI 助手 */}
                {showAIAssistant && (
                    <div
                        style={{
                            position: 'fixed',
                            width: 360,
                            right: 0,
                            top: 64,
                            bottom: 0,
                            zIndex: 100,
                            background: '#fff',
                            borderLeft: '1px solid #f0f0f0',
                            boxShadow: '-2px 0 8px rgba(0,0,0,.06)',
                        }}
                    >
                        <AIAssistant onClose={() => setShowAIAssistant(false)}/>
                    </div>
                )}
            </Layout>
        </Layout>
    );
};

export default MainDesign;