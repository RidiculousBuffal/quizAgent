/* eslint-disable react-hooks/exhaustive-deps */
// MultipleChoiceEditComponent.tsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Button, Space, InputNumber, Select, Tag, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import { MultipleChoiceQuestion } from './checkbox.ts';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BaseQuestionEditParams } from "../BaseQuestion.ts";

interface MultipleChoiceEditProps extends BaseQuestionEditParams {
    question: MultipleChoiceQuestion;
    onChange: (question: MultipleChoiceQuestion) => void;
}

// 单个可排序选项组件
const SortableOption = ({
    option,
    onTextChange,
    onRemove,
    onToggleExclusive,
    isExclusive,
    canDelete
}: {
    option: { id: number; text: string; value: string | number };
    onTextChange: (id: number, text: string) => void;
    onRemove: (id: number) => void;
    onToggleExclusive: (id: number) => void;
    isExclusive: boolean;
    canDelete: boolean;
}) => {
    // 添加本地状态管理选项文本
    const [localText, setLocalText] = useState(option.text);

    // 当选项变化时更新本地状态
    useEffect(() => {
        setLocalText(option.text);
    }, [option.id, option.text]);

    // 处理文本变化
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalText(e.target.value);
    };

    // 失去焦点时更新选项
    const handleTextBlur = () => {
        if (localText !== option.text) {
            onTextChange(option.id, localText);
        }
    };

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: option.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex',
        marginBottom: 8,
        padding: '4px 8px',
        border: '1px solid #f0f0f0',
        borderRadius: '4px',
        backgroundColor: 'white',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            {/* 添加拖动手柄区域 */}
            <div
                {...listeners}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: 8,
                    cursor: 'grab',
                    padding: '0 8px',
                    color: '#999'
                }}
            >
                ⋮⋮
            </div>

            <Input
                value={localText}
                onChange={handleTextChange}
                onBlur={handleTextBlur}
                style={{ width: '300px', marginRight: 8 }}
                onClick={(e) => e.stopPropagation()} // 防止点击输入框触发拖动
            />

            <Space>
                <Tooltip title={isExclusive ? "取消互斥选项" : "设为互斥选项"}>
                    <Button
                        type={isExclusive ? "primary" : "default"}
                        icon={<LockOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExclusive(option.id);
                        }}
                    />
                </Tooltip>
                <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(option.id);
                    }}
                    disabled={!canDelete}
                />
            </Space>
        </div>
    );
};

const MultipleChoiceEditComponent: React.FC<MultipleChoiceEditProps> = ({ question, onChange }) => {
    // 添加本地状态来管理输入
    const [localTitle, setLocalTitle] = useState(question.title);
    const [localDescription, setLocalDescription] = useState(question.description || '');

    // 当外部 question 属性变化时，更新本地状态
    useEffect(() => {
        setLocalTitle(question.title);
        setLocalDescription(question.description || '');
    }, [question.id]); // 只在问题ID变化时更新，避免循环更新

    // 设置拖拽传感器
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 标题失去焦点时更新问题
    const handleTitleBlur = () => {
        if (localTitle !== question.title) {
            const updatedQuestion = question.clone();
            updatedQuestion.title = localTitle;
            onChange(updatedQuestion);
        }
    };

    // 描述失去焦点时更新问题
    const handleDescriptionBlur = () => {
        if (localDescription !== question.description) {
            const updatedQuestion = question.clone();
            updatedQuestion.description = localDescription;
            onChange(updatedQuestion);
        }
    };

    // 处理标题按下回车键
    const handleTitlePressEnter = () => {
        handleTitleBlur();
    };

    // 处理描述按下回车键
    const handleDescriptionPressEnter = () => {
        handleDescriptionBlur();
    };

    const handleRequiredChange = (checked: boolean) => {
        const updatedQuestion = question.clone();
        updatedQuestion.isRequired = checked;
        onChange(updatedQuestion);
    };

    const handleOptionTextChange = (id: number, text: string) => {
        const updatedQuestion = question.clone();
        const option = updatedQuestion.options.find(opt => opt.id === id);
        if (option) {
            option.text = text;
            onChange(updatedQuestion);
        }
    };

    const addOption = () => {
        const updatedQuestion = question.clone();
        updatedQuestion.addOption('新选项');
        onChange(updatedQuestion);
    };

    const removeOption = (id: number) => {
        const updatedQuestion = question.clone();
        updatedQuestion.removeOption(id);
        onChange(updatedQuestion);
    };

    const handleAllowOtherChange = (checked: boolean) => {
        const updatedQuestion = question.clone();
        updatedQuestion.allowOther = checked;
        onChange(updatedQuestion);
    };

    const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedQuestion = question.clone();
        updatedQuestion.otherText = e.target.value;
        onChange(updatedQuestion);
    };

    const handleMinSelectedChange = (value: number | null) => {
        const updatedQuestion = question.clone();
        updatedQuestion.minSelected = value || undefined;
        onChange(updatedQuestion);
    };

    const handleMaxSelectedChange = (value: number | null) => {
        const updatedQuestion = question.clone();
        updatedQuestion.maxSelected = value || undefined;
        onChange(updatedQuestion);
    };

    const handleRandomizeOptionsChange = (checked: boolean) => {
        const updatedQuestion = question.clone();
        updatedQuestion.randomizeOptions = checked;
        onChange(updatedQuestion);
    };

    const handleDisplayInColumnsChange = (value: number) => {
        const updatedQuestion = question.clone();
        updatedQuestion.displayInColumns = value;
        onChange(updatedQuestion);
    };

    const toggleExclusiveOption = (optionId: number) => {
        const updatedQuestion = question.clone();
        updatedQuestion.toggleExclusiveOption(optionId);
        onChange(updatedQuestion);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const updatedQuestion = question.clone();
            const oldIndex = updatedQuestion.options.findIndex(opt => opt.id === active.id);
            const newIndex = updatedQuestion.options.findIndex(opt => opt.id === over.id);

            updatedQuestion.options = arrayMove(
                updatedQuestion.options,
                oldIndex,
                newIndex
            );

            onChange(updatedQuestion);
        }
    };

    return (
        <div className="question-edit">
            <Form layout="vertical">
                <Form.Item label="问题标题">
                    <Input
                        value={localTitle}
                        onChange={(e) => setLocalTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        onPressEnter={handleTitlePressEnter}
                    />
                </Form.Item>

                <Form.Item label="问题描述">
                    <Input
                        value={localDescription}
                        onChange={(e) => setLocalDescription(e.target.value)}
                        onBlur={handleDescriptionBlur}
                        onPressEnter={handleDescriptionPressEnter}
                    />
                </Form.Item>

                <Form.Item label="是否必填">
                    <Switch checked={question.isRequired} onChange={handleRequiredChange} />
                </Form.Item>

                <Form.Item label="选择限制">
                    <Space>
                        <span>最少选择:</span>
                        <InputNumber
                            min={0}
                            max={question.options.length}
                            value={question.minSelected}
                            onChange={handleMinSelectedChange}
                        />
                        <span>最多选择:</span>
                        <InputNumber
                            min={0}
                            max={question.options.length}
                            value={question.maxSelected}
                            onChange={handleMaxSelectedChange}
                        />
                    </Space>
                </Form.Item>

                <Form.Item label="随机排序选项">
                    <Switch checked={question.randomizeOptions} onChange={handleRandomizeOptionsChange} />
                </Form.Item>

                <Form.Item label="选项列数">
                    <Select
                        value={question.displayInColumns}
                        onChange={handleDisplayInColumnsChange}
                        style={{ width: 120 }}
                    >
                        <Select.Option value={1}>1列</Select.Option>
                        <Select.Option value={2}>2列</Select.Option>
                        <Select.Option value={3}>3列</Select.Option>
                        <Select.Option value={4}>4列</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="选项">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={question.options.map(opt => opt.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div style={{ marginBottom: 16 }}>
                                {question.options.map((option) => (
                                    <SortableOption
                                        key={option.id}
                                        option={option}
                                        onTextChange={handleOptionTextChange}
                                        onRemove={removeOption}
                                        onToggleExclusive={toggleExclusiveOption}
                                        isExclusive={question.isExclusiveOption(option.id)}
                                        canDelete={question.options.length > 1}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <Button
                        type="dashed"
                        onClick={addOption}
                        icon={<PlusOutlined />}
                        style={{ width: '300px', marginTop: 8 }}
                    >
                        添加选项
                    </Button>

                    {question.exclusiveOptions.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                            <span>互斥选项: </span>
                            {question.exclusiveOptions.map(id => {
                                const option = question.options.find(opt => opt.id === id);
                                return option ? (
                                    <Tag key={id} color="blue">{option.text}</Tag>
                                ) : null;
                            })}
                        </div>
                    )}
                </Form.Item>

                <Form.Item label="允许其他选项">
                    <Switch checked={question.allowOther} onChange={handleAllowOtherChange} />
                </Form.Item>

                {question.allowOther && (
                    <Form.Item label="其他选项文本">
                        <Input
                            value={question.otherText}
                            onChange={handleOtherTextChange}
                            placeholder="例如：其他、请说明..."
                        />
                    </Form.Item>
                )}
            </Form>
        </div>
    );
};

export default MultipleChoiceEditComponent;