import React, { useState, useEffect } from 'react';
import { Radio, Space, Input, Typography } from 'antd';
import { SingleChoiceQuestion } from './radio.ts';

const { Text } = Typography;

interface SingleChoicePreviewProps {
    question: SingleChoiceQuestion;
    value: string;
    onChange: (value: string) => void;
    showValidation?: boolean;
}
import './radio.css'
import '../base.css'
const SingleRadioPreview: React.FC<SingleChoicePreviewProps> = ({
                                                                     question,
                                                                     value,
                                                                     onChange,
                                                                     showValidation = false
                                                                 }) => {
    // 分离"other:"前缀，提取纯文本值
    const [otherValue, setOtherValue] = useState('');

    // 判断当前是否选中"其他"选项
    const isOtherSelected = value === 'other' || value?.startsWith('other:');

    // 当value变化时，更新otherValue
    useEffect(() => {
        if (value?.startsWith('other:')) {
            setOtherValue(value.substring(6)); // 移除 "other:" 前缀
        }
    }, [value]);

    // 处理单选按钮变化
    const handleRadioChange = (e: any) => {
        const selectedValue = e.target.value;

        // 如果选择的是"其他"选项，保留已输入的文本
        if (selectedValue === 'other') {
            onChange(otherValue ? `other:${otherValue}` : 'other');
        } else {
            onChange(selectedValue);
        }
    };

    // 处理"其他"输入框变化
    const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setOtherValue(inputValue);

        // 更新包含"其他"值的选项
        onChange(`other:${inputValue}`);
    };

    // 阻止输入框点击事件冒泡，避免触发Radio的点击事件
    const handleInputClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        // 如果点击输入框时"其他"选项未被选中，则选中它
        if (!isOtherSelected) {
            onChange(otherValue ? `other:${otherValue}` : 'other');
        }
    };

    // 验证结果
    const validationResult = showValidation ? question.validate(value) : true;
    const isValid = typeof validationResult === 'boolean' ? validationResult : validationResult.isValid;
    const errorMessage = typeof validationResult === 'boolean' ? '' : validationResult.message;

    // 确定Radio组的值
    const radioValue = isOtherSelected ? 'other' : value;

    return (
        <div className="question-preview">
            <div className="question-title">
                {question.title}
                {question.isRequired && <span className="required-mark">*</span>}
            </div>

            {question.description && (
                <div className="question-description">{question.description}</div>
            )}

            <Radio.Group
                onChange={handleRadioChange}
                value={radioValue}
            >
                <Space direction="vertical">
                    {question.options.map(option => (
                        <Radio key={option.id} value={option.value.toString()}>
                            {option.text}
                        </Radio>
                    ))}

                    {question.allowOther && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Radio value="other">{question.otherText}</Radio>
                            {/* 使用div包装输入框，防止事件冒泡 */}
                            <div onClick={(e) => e.stopPropagation()} style={{ marginLeft: 8 }}>
                                <Input
                                    value={otherValue}
                                    onChange={handleOtherInputChange}
                                    onClick={handleInputClick}
                                    onFocus={() => {
                                        if (!isOtherSelected) {
                                            onChange(otherValue ? `other:${otherValue}` : 'other');
                                        }
                                    }}
                                    placeholder="请输入..."
                                    style={{
                                        width: 200,
                                        opacity: isOtherSelected ? 1 : 0.5
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </Space>
            </Radio.Group>

            {showValidation && !isValid && (
                <Text type="danger">{errorMessage}</Text>
            )}
        </div>
    );
};

export default SingleRadioPreview;