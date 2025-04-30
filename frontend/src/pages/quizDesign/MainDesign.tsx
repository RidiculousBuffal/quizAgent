// 修改MainDesign.tsx，添加AI助手按钮和侧边栏
import React, {useEffect, useState, useCallback} from "react";
import {v4 as uuid} from 'uuid'
import {Layout, Button, Divider, Empty, Typography, message, Spin, Segmented} from "antd";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core";
import {SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {
    SaveOutlined,
    EditOutlined,
    CheckCircleOutlined,
    CheckSquareOutlined,
    CheckOutlined,
    LoadingOutlined,
    EyeOutlined,
    RobotOutlined
} from "@ant-design/icons";
import {useQuestionStore} from "../../store/question/QuestionStore";
import QuestionTypeList from "./QuestionTypeList";
import SortableQuestionCard from "./SortableQuestionCard";
import QuestionEditWrapper from "../../lib/Questions/QuestionWarpper/QuestionEditWrapper";
import QuestionViewWrapper from "../../lib/Questions/QuestionWarpper/QuestionPreviewWrapper.tsx";
import {QuestionFactory} from "../../lib/Questions/QuestionFactory";
import {QuestionType} from "../../lib/Questions/QuestionType";
import {deleteQuestionBackend, getAllQuestionsInQuiz, saveAllQuestions} from "../../api/questionapi.ts";
import {useQuizStore} from "../../store/quiz/QuizStore.ts";
import {ArrowLeft} from "lucide-react";
import {useNavigate} from "react-router";
import AIAssistant from "../../components/AIAssistant/AIAssistant.tsx"; // 导入AI助手组件

const {Header, Sider, Content} = Layout;
const {Title, Text} = Typography;

// 配置你的类型（typeId 一定与 factory 注册一致！）
const questionTypes: { key: string; icon: React.ReactNode; title: string; type: QuestionType }[] = [
    {
        key: "single",
        icon: <CheckCircleOutlined/>,
        title: "单选题",
        type: {typeId: 1, typeName: "radio", typeDescription: "单选题"},
    },
    {
        key: "multi",
        icon: <CheckSquareOutlined/>,
        title: "多选题",
        type: {typeId: 2, typeName: "checkbox", typeDescription: "多选题"},
    },
    {
        key: "input",
        icon: <EditOutlined/>,
        title: "填空题",
        type: {typeId: 3, typeName: "fillblank", typeDescription: "填空题"},
    },
];

const MainDesign = () => {
    // 当前选中的题目ID
    const [activeId, setActiveId] = useState<number | null>(null);
    // 保存状态: 'idle', 'saving', 'saved', 'error'
    const [savingStatus, setSavingStatus] = useState('idle');
    // 是否有未保存的更改
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    // 保存按钮loading状态
    const [isSaving, setIsSaving] = useState(false);
    // 当前模式：编辑或预览
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    // 是否显示AI助手
    const [showAIAssistant, setShowAIAssistant] = useState(false);

    // 从全局store获取和操作问题数据
    const questionAnswer = useQuestionStore((s) => s.questionAnswer);
    const setQuestion = useQuestionStore(q => q.setRawQuestions);
    const addQuestion = useQuestionStore((s) => s.addQuestion);
    const deleteQuestion = useQuestionStore((s) => s.deleteQuestion);
    const sortQuestions = useQuestionStore((s) => s.sortQuestions);
    // 题目数组
    const questions = questionAnswer.map((qa) => qa.question)
    const nav = useNavigate();
    // 拖拽传感器
    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    );

    const currentQuizId = useQuizStore((q) => q.curEditQuizId)

    useEffect(() => {
        getAllQuestionsInQuiz(currentQuizId!).then(
            r => {
                if (r) {
                    setQuestion(r);
                }
            }
        )
    }, [currentQuizId, setQuestion])

    // 跟踪题目变更
    useEffect(() => {
        if (questions.length > 0) {
            setHasUnsavedChanges(true);
        }
    }, [questionAnswer, questions.length]);

    // 保存问卷函数
    const saveQuestions = useCallback(async () => {
        if (!hasUnsavedChanges) return;

        try {
            setSavingStatus('saving');
            setIsSaving(true);
            await saveAllQuestions();
            setSavingStatus('saved');
            setHasUnsavedChanges(false);

            // 3秒后重置状态为idle
            setTimeout(() => {
                setSavingStatus('idle');
            }, 3000);
        } catch (error) {
            setSavingStatus('error');
            message.error('保存问卷失败，请稍后重试');
            console.error('Error saving questions:', error);
        } finally {
            setIsSaving(false);
        }
    }, [hasUnsavedChanges]);

    // 自动保存
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (hasUnsavedChanges && savingStatus !== 'saving') {
                saveQuestions().then();
            }
        }, 5000);

        return () => clearInterval(autoSaveInterval);
    }, [hasUnsavedChanges, savingStatus, saveQuestions]);

    const handleAddQuestion = (type: QuestionType) => {
        // 自动补充各题型不同参数
        const id = Date.now();
        const params: any = {
            id,
            title: `新建${type.typeDescription}`,
            sort: id,
        };
        // 针对不同题型补充必要项
        if (type.typeName === 'fillblank') {
            params.blankCount = 1;
            params.blankLabels = ['填空 1'];
            params.answerType = 'text';
            params.correctAnswers = [[]];
            params.inlineMode = false;
            params.isRequired = false;
        } else if (type.typeName === 'checkbox') {
            params.options = [{key: uuid(), text: '选项 1', value: uuid()}, {
                key: uuid(),
                text: '选项 2',
                value: uuid()
            }];
            params.isRequired = false;
            params.randomizeOptions = false;
            params.displayInColumns = 1;
            params.exclusiveOptions = [];
            params.allowOther = false;
            params.otherText = '';
        } else if (type.typeName === 'radio') {
            params.options = [{key: uuid(), text: '选项 1', value: uuid()}, {
                key: uuid(),
                text: '选项 2',
                value: uuid()
            }];
            params.isRequired = false;
            params.allowOther = false;
            params.otherText = '';
        }
        const newQuestion = QuestionFactory.createQuestion(type, params);
        addQuestion(newQuestion);
        setActiveId(newQuestion.id);
    };

    // 拖拽排序
    const handleDragEnd = ({active, over}: DragEndEvent) => {
        if (over && active.id !== over.id) {
            const activeId = Number(active.id);
            const overId = Number(over.id);
            sortQuestions(activeId, overId);
        }
    };

    const handleDelete = (id: number) => {
        deleteQuestion(id);
        deleteQuestionBackend(id).then(r => r)
        setActiveId((prev) => (prev === id ? null : prev));
    };

    const handleDuplicate = (id: number) => {
        const q = questions.find((q) => q.id === id);
        if (!q) return;
        // 每个BaseQuestion都建议有clone方法！没有就简单new
        const newId = Date.now();
        const copy = q.clone
            ? q.clone()
            : QuestionFactory.createQuestion(q.type, {
                ...q,
                id: newId,
                title: q.title + " (副本)",
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

    // 渲染保存状态
    const renderSaveStatus = () => {
        switch (savingStatus) {
            case 'saving':
                return (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Spin
                            indicator={<LoadingOutlined style={{fontSize: 18, marginRight: 8}} spin/>}
                        />
                        <Text type="secondary" style={{marginLeft: 8}}>问卷保存中...</Text>
                    </div>
                );
            case 'saved':
                return (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <CheckOutlined style={{color: '#52c41a', fontSize: 16, marginRight: 8}}/>
                        <Text type="success">问卷已保存</Text>
                    </div>
                );
            case 'error':
                return <Text type="danger" style={{fontWeight: 'bold'}}>保存失败，请手动保存</Text>;
            default:
                return hasUnsavedChanges ?
                    <Text type="warning" style={{fontWeight: 'bold'}}>有未保存的更改</Text> : null;
        }
    };

    return (
        <Layout style={{maxHeight: "100vh", minHeight: "100vh"}}>
            <Header style={{background: "#fff", padding: "0 16px", borderBottom: "1px solid #f0f0f0"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%"}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Title level={4} style={{margin: 0, marginRight: 16}}>问卷设计</Title>
                        <Segmented
                            options={[
                                {value: 'edit', label: <><EditOutlined/> 编辑模式</>},
                                {value: 'preview', label: <><EyeOutlined/> 预览模式</>},
                            ]}
                            value={mode}
                            onChange={(value) => setMode(value as 'edit' | 'preview')}
                            style={{marginRight: 16}}
                        />
                        {renderSaveStatus()}
                    </div>
                    <div style={{display: "flex", gap: "10px"}}>
                        {/* AI助手按钮 */}
                        <Button
                            icon={<RobotOutlined/>}
                            type={showAIAssistant ? "primary" : "default"}
                            onClick={() => setShowAIAssistant(!showAIAssistant)}
                        >
                            AI助手
                        </Button>
                        <Button icon={<ArrowLeft/>} onClick={() => {
                            nav('/dashboard')
                        }}>返回</Button>
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

            {/* 主布局区域 - 使用Flex布局实现左中右结构 */}
            <Layout style={{ position: 'relative', height: 'calc(100vh - 64px)' }}>
                {/* 左侧题目列表 */}
                <Sider width="20%" style={{background: "#fff", padding: "16px", overflowY: "auto"}}>
                    <QuestionTypeList
                        questionTypes={questionTypes}
                        onAddQuestion={handleAddQuestion}
                    />
                    <Divider/>
                    <Title level={5}>题目列表</Title>
                    {questions.length === 0 ? (
                        <Empty description="暂无题目"/>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
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

                {/* 中部内容区，调整右边距，为AI助手预留空间 */}
                <Content style={{
                    padding: "20px",
                    background: "#f5f5f5",
                    overflowY: "auto",
                    marginRight: showAIAssistant ? '360px' : 0,
                    transition: 'margin-right 0.3s'
                }}>
                    {activeId && questions.find(q => q.id === activeId) ? (
                        mode === 'edit' ? (
                            <QuestionEditWrapper id={activeId}/>
                        ) : (
                            <QuestionViewWrapper id={activeId}/>
                        )
                    ) : (
                        <Empty description="请从左侧添加或选择题目进行编辑" style={{marginTop: "100px"}}/>
                    )}
                </Content>

                {/* 右侧AI助手 - 固定在右侧 */}
                {showAIAssistant && (
                    <div style={{
                        position: 'fixed',
                        width: '360px',
                        top: '64px', // Header高度
                        bottom: 0,
                        right: 0,
                        background: "#fff",
                        borderLeft: "1px solid #f0f0f0",
                        zIndex: 100,
                        boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.06)',
                        overflow: 'hidden'
                    }}>
                        <AIAssistant onClose={() => setShowAIAssistant(false)}/>
                    </div>
                )}
            </Layout>
        </Layout>
    );
};

export default MainDesign;