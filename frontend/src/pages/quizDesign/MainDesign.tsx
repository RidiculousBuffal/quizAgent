import React, {useState} from "react";
import {v4 as uuid} from 'uuid'
import {Layout, Button, Divider, Empty, Typography, message} from "antd";
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
import {SaveOutlined, EditOutlined, CheckCircleOutlined, CheckSquareOutlined} from "@ant-design/icons";
import {useQuestionStore} from "../../store/question/QuestionStore";
import QuestionTypeList from "./QuestionTypeList";
import SortableQuestionCard from "./SortableQuestionCard";
import QuestionEditWrapper from "../../lib/Questions/QuestionWarpper/QuestionEditWrapper";
import {QuestionFactory} from "../../lib/Questions/QuestionFactory";
import {QuestionType} from "../../lib/Questions/QuestionType";
import {saveAllQuestions} from "../../api/questionapi.ts";

const {Header, Sider, Content} = Layout;
const {Title} = Typography;

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

    // 从全局store获取和操作问题数据
    const questionAnswer = useQuestionStore((s) => s.questionAnswer);
    const addQuestion = useQuestionStore((s) => s.addQuestion);
    const deleteQuestion = useQuestionStore((s) => s.deleteQuestion);
    const sortQuestions = useQuestionStore((s) => s.sortQuestions);
    // 题目数组
    const questions = questionAnswer.map((qa) => qa.question);

    // 拖拽传感器
    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    );


    const handleAddQuestion = (type: QuestionType) => {
        // 自动补充各题型不同参数，id 建议用 Date.now()
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
            params.options = [{key: uuid(), text: '选项 1'}, {key: uuid(), text: '选项 2'}];
            params.isRequired = false;
            params.randomizeOptions = false;
            params.displayInColumns = 1;
            params.exclusiveOptions = [];
            params.allowOther = false;
            params.otherText = '';
        } else if (type.typeName === 'radio') {
            params.options = [{key: uuid(), text: '选项 1'}, {key: uuid(), text: '选项 2'}];
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
            setActiveId(overId);
        }
    };

    const handleDelete = (id: number) => {
        deleteQuestion(id);
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

    return (
        <Layout style={{maxHeight: "100vh", minHeight: "100vh"}}>
            <Header style={{background: "#fff", padding: "0 16px", borderBottom: "1px solid #f0f0f0"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%"}}>
                    <Title level={4} style={{margin: 0}}>问卷设计</Title>
                    <Button icon={<SaveOutlined/>} type="primary"
                            onClick={() => {
                                saveAllQuestions().then()
                            }}>保存问卷</Button>
                </div>
            </Header>
            <Layout>
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
                <Content style={{padding: "20px", background: "#f5f5f5", overflowY: "auto"}}>
                    {activeId && questions.find(q => q.id === activeId) ? (
                        <QuestionEditWrapper id={activeId}/>
                    ) : (
                        <Empty description="请从左侧添加或选择题目进行编辑" style={{marginTop: "100px"}}/>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainDesign;