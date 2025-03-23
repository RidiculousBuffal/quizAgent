// MultipleChoicePreviewComponent.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Checkbox, Space, Input, Typography, Row, Col, Tag } from 'antd';
import { MultipleChoiceQuestion } from './checkbox.ts';
import {BaseQuestionPreviewParams} from "../BaseQuestion.ts";

const { Text } = Typography;

interface MultipleChoicePreviewProps extends BaseQuestionPreviewParams{
    question: MultipleChoiceQuestion;
    value: string[];
    onChange: (value: string[]) => void;
    showValidation?: boolean;
}

const MultipleChoicePreviewComponent: React.FC<MultipleChoicePreviewProps> = ({
    question,
    value = [],
    onChange,
    showValidation = false
}) => {
    const [otherValue, setOtherValue] = useState('');
    const isOtherSelected = value.includes('other');

    // 使用 useMemo 生成随机排序的选项，并确保它们在组件生命周期内保持稳定
    // 只有当 question.options 或 question.randomizeOptions 改变时才会重新计算
    const displayOptions = useMemo(() => {
        let options = [...question.options];

        // 只有当启用随机排序时才打乱顺序
        if (question.randomizeOptions) {
            // 使用稳定的随机排序算法
            options = [...options].sort((a, b) => {
                // 使用选项ID作为种子生成伪随机数
                const seedA = a.id * 9973; // 使用质数作为乘数
                const seedB = b.id * 9973;
                return (seedA % 997) - (seedB % 997); // 使用另一个质数取模
            });
        }

        return options;
    }, [question.options, question.randomizeOptions]);

    // 处理选项变化
    const handleCheckboxChange = (checkedValues: string[]) => {
        // 检查是否选中了互斥选项
        const selectedExclusiveOptionId = question.exclusiveOptions.find(
            id => checkedValues.includes(id.toString())
        );

        // 如果选中了互斥选项，只保留该选项
        if (selectedExclusiveOptionId !== undefined) {
            const exclusiveValue = selectedExclusiveOptionId.toString();
            // 检查这个互斥选项是否是新选中的
            const wasExclusiveSelected = value.includes(exclusiveValue);
            const isExclusiveNewlySelected = checkedValues.includes(exclusiveValue) && !wasExclusiveSelected;

            if (isExclusiveNewlySelected) {
                // 如果互斥选项是新选中的，只保留该选项
                onChange([exclusiveValue]);
                return;
            }
        }

        // 如果选中了普通选项，移除所有互斥选项
        const hasNonExclusiveNewSelection = checkedValues.some(
            val => !question.exclusiveOptions.includes(parseInt(val)) && !value.includes(val)
        );

        if (hasNonExclusiveNewSelection) {
            const filteredValues = checkedValues.filter(
                val => !question.exclusiveOptions.includes(parseInt(val))
            );
            onChange(filteredValues);
            return;
        }

        // 处理"其他"选项
        if (isOtherSelected && !checkedValues.includes('other')) {
            // 如果"其他"被取消选中，移除"other"及其值
            onChange(checkedValues.filter(v => !v.startsWith('other:')));
        } else if (checkedValues.includes('other') && otherValue) {
            // 如果"其他"被选中且已有输入值，保留输入值
            const filteredValues = checkedValues.filter(v => v !== 'other');
            onChange([...filteredValues, `other:${otherValue}`]);
        } else {
            onChange(checkedValues);
        }
    };

    // 处理"其他"输入框变化
    const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setOtherValue(inputValue);

        // 更新包含"其他"值的选项
        if (isOtherSelected) {
            const filteredValues = value.filter(v => v !== 'other' && !v.startsWith('other:'));
            onChange([...filteredValues, `other:${inputValue}`]);
        }
    };

    // 从值中提取"其他"选项的文本
    useEffect(() => {
        const otherOption = value.find(v => v.startsWith('other:'));
        if (otherOption) {
            setOtherValue(otherOption.substring(6)); // 移除 "other:" 前缀
        }
    }, [value]);

    // 验证结果
    const validationResult = showValidation ? question.validate(value) : true;
    const isValid = typeof validationResult === 'boolean' ? validationResult : validationResult.isValid;
    const errorMessage = typeof validationResult === 'boolean' ? '' : validationResult.message;

    // 显示选择限制提示
    const getSelectionLimitText = () => {
        const { minSelected, maxSelected } = question;
        if (minSelected && maxSelected) {
            return `(请选择${minSelected}至${maxSelected}项)`;
        } else if (minSelected) {
            return `(请至少选择${minSelected}项)`;
        } else if (maxSelected) {
            return `(请最多选择${maxSelected}项)`;
        }
        return '';
    };

    const columns = question.displayInColumns || 1;

    // 根据列数划分选项
    const renderOptionsInColumns = () => {
        if (columns === 1) {
            return (
                <Checkbox.Group onChange={handleCheckboxChange} value={value}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {displayOptions.map(option => (
                            <Checkbox
                                key={option.id}
                                value={option.value}
                                disabled={
                                    // 如果有互斥选项被选中，禁用其他所有选项
                                    value.some(v => question.exclusiveOptions.includes(parseInt(v))) &&
                                    !question.exclusiveOptions.includes(option.id)
                                }
                            >
                                {option.text}
                                {question.isExclusiveOption(option.id) && (
                                    <Tag color="blue" style={{ marginLeft: 8 }}>互斥选项</Tag>
                                )}
                            </Checkbox>
                        ))}

                        {question.allowOther && (
                            <Space>
                                <Checkbox
                                    value="other"
                                    disabled={value.some(v => question.exclusiveOptions.includes(parseInt(v)))}
                                >
                                    {question.otherText}
                                </Checkbox>
                                {isOtherSelected && (
                                    <Input
                                        value={otherValue}
                                        onChange={handleOtherInputChange}
                                        onClick={e => e.stopPropagation()}
                                        style={{ width: 200 }}
                                    />
                                )}
                            </Space>
                        )}
                    </Space>
                </Checkbox.Group>
            );
        }

        // 多列显示
        return (
            <Checkbox.Group onChange={handleCheckboxChange} value={value} style={{ width: '100%' }}>
                <Row>
                    {displayOptions.map(option => (
                        <Col span={24 / columns} key={option.id} style={{ marginBottom: 8 }}>
                            <Checkbox
                                value={option.value}
                                disabled={
                                    value.some(v => question.exclusiveOptions.includes(parseInt(v))) &&
                                    !question.exclusiveOptions.includes(option.id)
                                }
                            >
                                {option.text}
                                {question.isExclusiveOption(option.id) && (
                                    <Tag color="blue" style={{ marginLeft: 8 }}>互斥选项</Tag>
                                )}
                            </Checkbox>
                        </Col>
                    ))}

                    {question.allowOther && (
                        <Col span={24} style={{ marginTop: 8 }}>
                            <Space>
                                <Checkbox
                                    value="other"
                                    disabled={value.some(v => question.exclusiveOptions.includes(parseInt(v)))}
                                >
                                    {question.otherText}
                                </Checkbox>
                                {isOtherSelected && (
                                    <Input
                                        value={otherValue}
                                        onChange={handleOtherInputChange}
                                        onClick={e => e.stopPropagation()}
                                        style={{ width: 200 }}
                                    />
                                )}
                            </Space>
                        </Col>
                    )}
                </Row>
            </Checkbox.Group>
        );
    };

    return (
        <div className="question-preview">
            <div className="question-title">
                {question.title}
                {question.isRequired && <span className="required-mark">*</span>}
                <span className="selection-limit">{getSelectionLimitText()}</span>
            </div>

            {question.description && (
                <div className="question-description">{question.description}</div>
            )}

            {renderOptionsInColumns()}

            {showValidation && !isValid && (
                <Text type="danger">{errorMessage}</Text>
            )}
        </div>
    );
};

export default MultipleChoicePreviewComponent;