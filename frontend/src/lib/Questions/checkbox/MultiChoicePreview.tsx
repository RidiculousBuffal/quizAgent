import React, { useState, useEffect, useMemo, useRef } from 'react';
import {Checkbox, Space, Input, Typography, Row, Col, Tag, GetRef} from 'antd';
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
    const otherInputRef = useRef<GetRef<typeof Input>>(null);

    // 检查是否选中了"其他"选项（包括带有other:前缀的值）
    const isOtherSelected = value.includes('other') || value.some(v => v.startsWith('other:'));

    // 计算实际的checkbox值，确保"other:"前缀的值被映射为"other"
    const checkboxValues = useMemo(() => {
        return value.map(v => v.startsWith('other:') ? 'other' : v);
    }, [value]);

    // 使用 useMemo 生成随机排序的选项，并确保它们在组件生命周期内保持稳定
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
            const wasExclusiveSelected = checkboxValues.includes(exclusiveValue);
            const isExclusiveNewlySelected = checkedValues.includes(exclusiveValue) && !wasExclusiveSelected;

            if (isExclusiveNewlySelected) {
                // 如果互斥选项是新选中的，只保留该选项
                onChange([exclusiveValue]);
                return;
            }
        }

        // 如果选中了普通选项，移除所有互斥选项
        const hasNonExclusiveNewSelection = checkedValues.some(
            val => !question.exclusiveOptions.includes(parseInt(val)) && !checkboxValues.includes(val)
        );

        if (hasNonExclusiveNewSelection) {
            const filteredValues = checkedValues.filter(
                val => !question.exclusiveOptions.includes(parseInt(val))
            );
            onChange(filteredValues);
            return;
        }

        // 处理"其他"选项
        const wasOtherSelected = isOtherSelected;
        const isOtherNowSelected = checkedValues.includes('other');

        if (wasOtherSelected && !isOtherNowSelected) {
            // 如果"其他"被取消选中，移除"other"及其值
            const newValues = value.filter(v => !v.startsWith('other:') && v !== 'other');
            onChange(newValues);
            setOtherValue('');
        } else if (!wasOtherSelected && isOtherNowSelected) {
            // 如果"其他"被新选中
            const newValues = [
                ...checkedValues.filter(v => v !== 'other'),
                `other:${otherValue}`
            ];
            onChange(newValues);
            // 聚焦到输入框
            setTimeout(() => {
                otherInputRef.current?.focus();
            }, 0);
        } else {
            // 保持其他选项不变，只更新非"其他"选项
            const otherOptionValue = value.find(v => v.startsWith('other:')) || (isOtherSelected ? `other:${otherValue}` : null);
            const newValues = checkedValues.filter(v => v !== 'other');

            if (otherOptionValue && isOtherNowSelected) {
                newValues.push(otherOptionValue);
            }

            onChange(newValues);
        }
    };

    // 处理"其他"输入框变化
    const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setOtherValue(inputValue);

        // 更新包含"其他"值的选项
        if (isOtherSelected) {
            // 保留所有非"其他"选项的值
            const filteredValues = value.filter(v => v !== 'other' && !v.startsWith('other:'));
            // 添加新的"其他"值
            onChange([...filteredValues, `other:${inputValue}`]);
        }
    };

    // 从值中提取"其他"选项的文本
    useEffect(() => {
        const otherOption = value.find(v => v.startsWith('other:'));
        if (otherOption) {
            setOtherValue(otherOption.substring(6)); // 移除 "other:" 前缀
        } else if (isOtherSelected && !otherValue) {
            // 如果选中了"其他"但没有值，设置一个空字符串
            onChange([...value.filter(v => v !== 'other'), 'other:']);
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

    // 自定义"其他"选项输入框
    const renderOtherInput = () => {
        if (!isOtherSelected) return null;

        return (
            <Input
                ref={otherInputRef}
                value={otherValue}
                onChange={handleOtherInputChange}
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                style={{ width: 200 }}
                autoFocus
            />
        );
    };

    // 阻止事件冒泡的包装器组件
    const StopPropagation: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
        >
            {children}
        </div>
    );

    // 根据列数划分选项
    const renderOptionsInColumns = () => {
        if (columns === 1) {
            return (
                <Checkbox.Group onChange={handleCheckboxChange} value={checkboxValues}>
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
                            <StopPropagation>
                                <Space>
                                    <Checkbox
                                        value="other"
                                        disabled={value.some(v => question.exclusiveOptions.includes(parseInt(v)))}
                                    >
                                        {question.otherText}
                                    </Checkbox>
                                    {renderOtherInput()}
                                </Space>
                            </StopPropagation>
                        )}
                    </Space>
                </Checkbox.Group>
            );
        }

        // 多列显示
        return (
            <Checkbox.Group onChange={handleCheckboxChange} value={checkboxValues} style={{ width: '100%' }}>
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
                            <StopPropagation>
                                <Space>
                                    <Checkbox
                                        value="other"
                                        disabled={value.some(v => question.exclusiveOptions.includes(parseInt(v)))}
                                    >
                                        {question.otherText}
                                    </Checkbox>
                                    {renderOtherInput()}
                                </Space>
                            </StopPropagation>
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