import React, { useState } from 'react';
import { Button, Card, Divider, Empty, Layout, message, Space, Typography } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined
} from '@ant-design/icons';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './MainDesign.css'; // 导入CSS文件
// 导入题型组件
import InputEdit from '../../lib/Questions/input/inputEdit';
import MultiChoiceEdit from '../../lib/Questions/checkbox/MultiChoiceEdit';
import SingleRadioEdit from '../../lib/Questions/radio/SingleRadioEdit';

// 导入题型类
import { FillBlankQuestion } from '../../lib/Questions/input/input';
import { MultipleChoiceQuestion } from '../../lib/Questions/checkbox/checkbox';
import { SingleChoiceQuestion } from '../../lib/Questions/radio/radio';
import { BaseQuestion } from '../../lib/Questions/BaseQuestion';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// 定义题型类型
type QuestionType = 'input' | 'multiChoice' | 'singleChoice';

// 题型信息
const questionTypes = [
  { key: 'input', icon: <EditOutlined />, title: '填空题' },
  { key: 'multiChoice', icon: <CheckSquareOutlined />, title: '多选题' },
  { key: 'singleChoice', icon: <CheckCircleOutlined />, title: '单选题' },
];

// 创建新题目的工厂函数
const createNewQuestion = (type: QuestionType): BaseQuestion => {
  const id = Date.now()

  switch (type) {
    case 'input': {
      return new FillBlankQuestion({
        id,
        type: {
          typeId: 4,
          typeName: 'fillblank',
          typeDescription: '填空题',
        },
        title: '新建填空题',
        blankCount: 1,
        blankLabels: ['填空 1'],
        answerType: 'text',
        correctAnswers: [[]],
        inlineMode: false,
        isRequired: false,
        sort: id
      });
    }

    case 'multiChoice': {
      const multiChoice = new MultipleChoiceQuestion({
        id,
        type: {
          typeId: 3,
          typeName: 'checkbox',
          typeDescription: '多选题',
        },
        title: '新建多选题',
        isRequired: false,
        randomizeOptions: false,
        displayInColumns: 1,
        exclusiveOptions: [],
        options: [],
        allowOther: false,
        otherText: '',
        sort: id
      });
      multiChoice.addOption('选项 1');
      multiChoice.addOption('选项 2');
      return multiChoice;
    }

    case 'singleChoice': {
      const singleChoice = new SingleChoiceQuestion({
        id,
        type: {
          typeId: 2,
          typeName: 'radio',
          typeDescription: '单选题',
        },
        title: '新建单选题',
        isRequired: false,
        options: [],
        allowOther: false,
        otherText: '',
        sort: id
      });
      singleChoice.addOption('选项 1');
      singleChoice.addOption('选项 2');
      return singleChoice;
    }


    default:
      throw new Error(`未知题型: ${type}`);
  }
};

// 可排序的问题卡片组件
const SortableQuestionCard = ({
  question,
  index,
  isActive,
  questionLength,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown
}: {
  question: BaseQuestion;
  index: number;
  isActive: boolean;
  questionLength: number;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
    transition: {
      duration: 150, // 减少过渡时间，使拖拽更流畅
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)' // 使用更流畅的缓动函数
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
    border: isActive ? '2px solid #1890ff' : '1px solid #f0f0f0',
    marginBottom: '10px',
    backgroundColor: isActive ? '#f0f7ff' : 'white',
    borderRadius: '4px',
    cursor: isDragging ? 'grabbing' : 'pointer',
    boxShadow: isDragging
      ? '0 5px 15px rgba(0, 0, 0, 0.15)'
      : isActive
        ? '0 2px 8px rgba(24, 144, 255, 0.2)'
        : 'none',
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 999 : 1,
    position: 'relative',
    transformOrigin: '50% 50%',
    willChange: 'transform, opacity, box-shadow', // 优化性能
  };

  return (
    <div ref={setNodeRef} style={{ ...style, position: 'relative' as const }} {...attributes}>
      <Card
        size="small"
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              {...listeners}
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                marginRight: '8px',
                color: '#999',
                transition: 'color 0.2s ease',
                userSelect: 'none', // 防止文本选择干扰拖拽
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#666'}
              onMouseOut={(e) => e.currentTarget.style.color = '#999'}
            >⋮⋮</div>
            <Text ellipsis style={{ maxWidth: '150px' }}>{question.title}</Text>
          </div>
        }
        extra={
          <Space size="small">
            <Button type="text" icon={<CopyOutlined />} onClick={(e) => { e.stopPropagation(); onDuplicate(); }} />
            <Button type="text" danger icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); onDelete(); }} />
          </Space>
        }
        onClick={onSelect}
        style={{
          transition: 'all 0.2s ease',
          border: 'none',
          background: 'transparent'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" ellipsis style={{ maxWidth: '150px' }}>
            {getQuestionTypeTitle(question)}
          </Text>
          <Space>
            <Button
              type="text"
              icon={<ArrowUpOutlined />}
              disabled={index === 0}
              onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            />
            <Button
              type="text"
              disabled={index === questionLength - 1}
              icon={<ArrowDownOutlined />}
              onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            />
          </Space>
        </div>
      </Card>
    </div>
  );
};

// 获取问题类型标题
const getQuestionTypeTitle = (question: BaseQuestion): string => {
  if (question instanceof FillBlankQuestion) return '填空题';
  if (question instanceof MultipleChoiceQuestion) return '多选题';
  if (question instanceof SingleChoiceQuestion) return '单选题';
  return '未知题型';
};

// 渲染编辑组件
const renderEditComponent = (question: BaseQuestion, onChange: (q: BaseQuestion) => void) => {
  if (question instanceof FillBlankQuestion) {
    return <InputEdit question={question} onChange={onChange as any} />;
  }

  if (question instanceof MultipleChoiceQuestion) {
    return <MultiChoiceEdit question={question} onChange={onChange as any} />;
  }

  if (question instanceof SingleChoiceQuestion) {
    return <SingleRadioEdit question={question} onChange={onChange as any} />;
  }

  return <Empty description="未知题型" />;
};

const MainDesign: React.FC = () => {
  // 问题列表状态
  const [questions, setQuestions] = useState<BaseQuestion[]>([]);
  // 当前选中的问题索引
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // 添加拖拽状态
  const [isDragging, setIsDragging] = useState(false);

  // 设置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 需要移动8px才会触发拖拽，防止误触
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 添加新问题
  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion = createNewQuestion(type);
    setQuestions([...questions, newQuestion]);
    setActiveIndex(questions.length); // 选中新添加的问题
  };

  // 更新问题
  const handleQuestionChange = (updatedQuestion: BaseQuestion) => {
    if (activeIndex === null) return;

    const newQuestions = [...questions];
    newQuestions[activeIndex] = updatedQuestion;
    setQuestions(newQuestions);
  };

  // 删除问题
  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);

    // 更新选中的问题
    if (activeIndex === index) {
      setActiveIndex(null);
    } else if (activeIndex !== null && activeIndex > index) {
      setActiveIndex(activeIndex - 1);
    }
  };

  // 复制问题
  const handleDuplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index];
    let duplicatedQuestion: BaseQuestion;

    // 根据问题类型创建副本
    if (questionToDuplicate instanceof FillBlankQuestion) {
      duplicatedQuestion = new FillBlankQuestion({
        ...questionToDuplicate,
        id: Date.now(),
        title: `${questionToDuplicate.title} (副本)`
      });
    } else if (questionToDuplicate instanceof MultipleChoiceQuestion) {
      duplicatedQuestion = questionToDuplicate.clone();
      duplicatedQuestion.id = Date.now();
      duplicatedQuestion.title = `${questionToDuplicate.title} (副本)`;
    } else if (questionToDuplicate instanceof SingleChoiceQuestion) {
      duplicatedQuestion = new SingleChoiceQuestion({
        ...questionToDuplicate,
        id: Date.now(),
        title: `${questionToDuplicate.title} (副本)`
      });
      // 复制选项
      questionToDuplicate.options.forEach(opt => {
        (duplicatedQuestion as SingleChoiceQuestion).addOption(opt.text);
      });
    } else {
      return; // 未知类型，不处理
    }

    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, duplicatedQuestion);
    setQuestions(newQuestions);
    setActiveIndex(index + 1); // 选中新复制的问题
  };

  // 上移问题
  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const newQuestions = [...questions];
    [newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]];
    setQuestions(newQuestions);

    if (activeIndex === index) {
      setActiveIndex(index - 1);
    } else if (activeIndex === index - 1) {
      setActiveIndex(index);
    }
  };

  // 下移问题
  const handleMoveDown = (index: number) => {
    if (index === questions.length - 1) return;

    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
    setQuestions(newQuestions);

    if (activeIndex === index) {
      setActiveIndex(index + 1);
    } else if (activeIndex === index + 1) {
      setActiveIndex(index);
    }
  };

  // 处理拖拽开始
  const handleDragStart = (event: { active: any; }) => {
    const { active } = event;
    setIsDragging(true);

    // 记录当前拖拽的元素索引
    const index = questions.findIndex(q => q.id === active.id);

    // 如果拖拽的是当前选中的题目，保持选中状态
    // 否则暂时取消选中状态，避免拖拽时的视觉干扰
    if (activeIndex !== index) {
      setActiveIndex(null);
    }

    document.body.style.cursor = 'grabbing';
    document.body.classList.add('dragging');
  };

  // 处理拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.classList.remove('dragging');

    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex(q => q.id === active.id);
      const newIndex = questions.findIndex(q => q.id === over.id);

      const newQuestions = [...questions];
      const [movedQuestion] = newQuestions.splice(oldIndex, 1);
      newQuestions.splice(newIndex, 0, movedQuestion);

      setQuestions(newQuestions);

      // 更新选中的问题
      if (activeIndex === oldIndex) {
        // 使用setTimeout确保状态更新在DOM渲染后进行，避免畸变
        setTimeout(() => {
          setActiveIndex(newIndex);
        }, 50);
      } else if (activeIndex !== null) {
        if (oldIndex < activeIndex && newIndex >= activeIndex) {
          setActiveIndex(activeIndex - 1);
        } else if (oldIndex > activeIndex && newIndex <= activeIndex) {
          setActiveIndex(activeIndex + 1);
        }
      }
    } else {
      // 如果没有移动位置，恢复之前的选中状态
      const index = questions.findIndex(q => q.id === active.id);
      if (activeIndex === null) {
        setTimeout(() => {
          setActiveIndex(index);
        }, 50);
      }
    }
  };

  // 保存问卷
  const handleSave = () => {
    // 这里可以添加保存逻辑，例如发送到后端API
    console.log('保存问卷:', questions);
    message.success('问卷已保存');
  };

  return (
    <Layout style={{ maxHeight: '100vh', minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <Title level={4} style={{ margin: 0 }}>问卷设计</Title>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存问卷</Button>
        </div>
      </Header>
      <Layout>
        <Sider width='20%' style={{ background: '#fff', padding: '16px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <Title level={5}>添加题目</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              {questionTypes.map(type => (
                <Button
                  key={type.key}
                  icon={type.icon}
                  onClick={() => handleAddQuestion(type.key as QuestionType)}
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  {type.title}
                </Button>
              ))}
            </Space>
          </div>

          <Divider />

          <div>
            <Title level={5}>题目列表</Title>
            {questions.length === 0 ? (
              <Empty description="暂无题目" />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={questions.map(q => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {questions.map((question, index, arr) => (
                    <SortableQuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      questionLength={arr.length}
                      isActive={activeIndex === index && !isDragging}
                      onSelect={() => setActiveIndex(index)}
                      onDelete={() => handleDeleteQuestion(index)}
                      onDuplicate={() => handleDuplicateQuestion(index)}
                      onMoveUp={() => handleMoveUp(index)}
                      onMoveDown={() => handleMoveDown(index)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </Sider>
        <Content style={{ padding: '20px', background: '#f5f5f5', overflowY: 'auto' }}>
          {activeIndex !== null && questions[activeIndex] ? (
            renderEditComponent(questions[activeIndex], handleQuestionChange)
          ) : (
            <Empty
              description="请从左侧添加或选择题目进行编辑"
              style={{ marginTop: '100px' }}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainDesign;