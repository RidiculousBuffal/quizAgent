import React from 'react';
import {Space, Divider, Empty, Typography} from 'antd';

import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import SortableQuestionCard from './SortableQuestionCard.tsx';
import {DndContext, DragEndEvent} from "@dnd-kit/core"; // 下面会给这个

const {Title} = Typography;

interface Props {
    questions: any[];
    sensors: any;
    onDragStart: (event: { active: any }) => void;
    onDragEnd: (event: DragEndEvent) => void;
    activeIndex: number | null;
    isDragging: boolean;
    onSelect: (idx: number) => void;
    onDelete: (idx: number) => void;
    onDuplicate: (idx: number) => void;
    onMoveUp: (idx: number) => void;
    onMoveDown: (idx: number) => void;
}

const QuestionList: React.FC<Props> = ({
                                           questions, sensors,
                                           onDragStart, onDragEnd,
                                           activeIndex, isDragging,
                                           onSelect, onDelete, onDuplicate, onMoveUp, onMoveDown
                                       }) => (
    <div>
        <Title level={5}>题目列表</Title>
        {questions.length === 0 ? (
            <Empty description="暂无题目"/>
        ) : (
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
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
                            onSelect={() => onSelect(index)}
                            onDelete={() => onDelete(index)}
                            onDuplicate={() => onDuplicate(index)}
                            onMoveUp={() => onMoveUp(index)}
                            onMoveDown={() => onMoveDown(index)}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        )}
    </div>
);

export default QuestionList;