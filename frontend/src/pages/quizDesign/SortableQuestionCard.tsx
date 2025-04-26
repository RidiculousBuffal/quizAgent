import {BaseQuestion} from "../../lib/Questions/BaseQuestion.ts";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Button, Card, Space, Typography} from "antd";
import {ArrowDownOutlined, ArrowUpOutlined, CopyOutlined, DeleteOutlined} from "@ant-design/icons";
import React from "react";
import {FillBlankQuestion} from "../../lib/Questions/input/input.ts";
import {MultipleChoiceQuestion} from "../../lib/Questions/checkbox/checkbox.ts";
import {SingleChoiceQuestion} from "../../lib/Questions/radio/radio.ts";

const {Text} = Typography;
const getQuestionTypeTitle = (question: BaseQuestion): string => {
    switch (question.type.typeId) {
        case 1: {
            return "单选题"
        }
        case 2: {
            return "多选题"
        }

        case 3: {
            return "填空题"
        }
        default:{
            return"未知提醒"
        }

    }
};
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
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
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
        <div ref={setNodeRef} style={{...style, position: 'relative' as const}} {...attributes}>
            <Card
                size="small"
                title={
                    <div style={{display: 'flex', alignItems: 'center'}}>
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
                        >⋮⋮
                        </div>
                        <Text ellipsis style={{maxWidth: '150px'}}>{question.title}</Text>
                    </div>
                }
                extra={
                    <Space size="small">
                        <Button type="text" icon={<CopyOutlined/>} onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate();
                        }}/>
                        <Button type="text" danger icon={<DeleteOutlined/>} onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}/>
                    </Space>
                }
                onClick={onSelect}
                style={{
                    transition: 'all 0.2s ease',
                    border: 'none',
                    background: 'transparent'
                }}
            >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text type="secondary" ellipsis style={{maxWidth: '150px'}}>
                        {getQuestionTypeTitle(question)}
                    </Text>
                    <Space>
                        <Button
                            type="text"
                            icon={<ArrowUpOutlined/>}
                            disabled={index === 0}
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveUp();
                            }}
                        />
                        <Button
                            type="text"
                            disabled={index === questionLength - 1}
                            icon={<ArrowDownOutlined/>}
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveDown();
                            }}
                        />
                    </Space>
                </div>
            </Card>
        </div>
    );
};
export default SortableQuestionCard