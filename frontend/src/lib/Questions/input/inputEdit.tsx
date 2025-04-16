import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Button,
    Space,
    Divider,
    Typography,
    Collapse,
    Row,
    Col,
    Card
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FillBlankQuestion, FillBlankParams, ValidationFunction } from './input';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;

interface InputEditProps {
    question: FillBlankQuestion;
    onChange: (question: FillBlankQuestion) => void;
}

const InputEdit: React.FC<InputEditProps> = ({ question, onChange }) => {
    const [params, setParams] = useState<FillBlankParams>({
        sort: 0,
        id: question.id,
        type: question.type,
        title: question.title,
        description: question.description,
        isRequired: question.isRequired,
        blankCount: question.blankCount,
        blankLabels: [...question.blankLabels],
        answerType: question.answerType,
        validators: JSON.parse(JSON.stringify(question.validators)),
        correctAnswers: JSON.parse(JSON.stringify(question.correctAnswers)),
        placeholder: question.placeholder,
        inlineMode: question.inlineMode,
        inlineText: question.inlineText,
    });

    useEffect(() => {
        const updatedQuestion = new FillBlankQuestion(params);
        onChange(updatedQuestion);
    }, [params, onChange]);

    const handleBasicChange = (field: keyof FillBlankParams, value: any) => {
        setParams(prev => ({ ...prev, [field]: value }));
    };

    const handleBlankCountChange = (value: number) => {
        const newCount = Math.max(1, value || 1);
        const newParams = { ...params, blankCount: newCount };

        // 确保标签数量与填空数量一致
        while (newParams.blankLabels.length < newCount) {
            newParams.blankLabels.push(`填空 ${newParams.blankLabels.length + 1}`);
        }
        newParams.blankLabels = newParams.blankLabels.slice(0, newCount);

        // 确保正确答案数组与填空数量一致
        while (newParams.correctAnswers.length < newCount) {
            newParams.correctAnswers.push([]);
        }
        newParams.correctAnswers = newParams.correctAnswers.slice(0, newCount);

        // 确保验证函数数组与填空数量一致
        while (newParams.validators.length < newCount) {
            newParams.validators.push([]);
        }
        newParams.validators = newParams.validators.slice(0, newCount);

        setParams(newParams);
    };

    const handleBlankLabelChange = (index: number, value: string) => {
        const newLabels = [...params.blankLabels];
        newLabels[index] = value;
        setParams(prev => ({ ...prev, blankLabels: newLabels }));
    };

    const handleCorrectAnswerChange = (blankIndex: number, answerIndex: number, value: string) => {
        const newCorrectAnswers = JSON.parse(JSON.stringify(params.correctAnswers));
        newCorrectAnswers[blankIndex][answerIndex] = value;
        setParams(prev => ({ ...prev, correctAnswers: newCorrectAnswers }));
    };

    const addCorrectAnswer = (blankIndex: number) => {
        const newCorrectAnswers = JSON.parse(JSON.stringify(params.correctAnswers));
        newCorrectAnswers[blankIndex].push('');
        setParams(prev => ({ ...prev, correctAnswers: newCorrectAnswers }));
    };

    const removeCorrectAnswer = (blankIndex: number, answerIndex: number) => {
        const newCorrectAnswers = JSON.parse(JSON.stringify(params.correctAnswers));
        newCorrectAnswers[blankIndex].splice(answerIndex, 1);
        setParams(prev => ({ ...prev, correctAnswers: newCorrectAnswers }));
    };

    // 简单验证器类型
    type ValidatorType = 'required' | 'minLength' | 'maxLength' | 'minValue' | 'maxValue' | 'regex' | 'custom';

    // 添加验证器
    const addValidator = (blankIndex: number, type: ValidatorType) => {
        const newValidators = JSON.parse(JSON.stringify(params.validators));

        let validator: ValidationFunction;

        switch (type) {
            case 'required':
                validator = {
                    validate: (value: string) => value.trim() !== '',
                    errorMessage: '此项为必填项'
                };
                break;
            case 'minLength':
                validator = {
                    validate: (value: string) => value.length >= 3,
                    errorMessage: '输入长度至少为3个字符'
                };
                break;
            case 'maxLength':
                validator = {
                    validate: (value: string) => value.length <= 100,
                    errorMessage: '输入长度不能超过100个字符'
                };
                break;
            case 'minValue':
                validator = {
                    validate: (value: string) => {
                        const num = parseFloat(value);
                        return !isNaN(num) && num >= 0;
                    },
                    errorMessage: '输入值必须大于等于0'
                };
                break;
            case 'maxValue':
                validator = {
                    validate: (value: string) => {
                        const num = parseFloat(value);
                        return !isNaN(num) && num <= 100;
                    },
                    errorMessage: '输入值必须小于等于100'
                };
                break;
            case 'regex':
                validator = {
                    validate: (value: string) => /^[a-zA-Z0-9]+$/.test(value),
                    errorMessage: '只能输入字母和数字'
                };
                break;
            default:
                validator = {
                    validate: (value: string) => true,
                    errorMessage: '自定义验证'
                };
        }

        newValidators[blankIndex].push(validator);
        setParams(prev => ({ ...prev, validators: newValidators }));
    };

    // 移除验证器
    const removeValidator = (blankIndex: number, validatorIndex: number) => {
        const newValidators = JSON.parse(JSON.stringify(params.validators));
        newValidators[blankIndex].splice(validatorIndex, 1);
        setParams(prev => ({ ...prev, validators: newValidators }));
    };

    // 更新验证器错误信息
    const updateValidatorErrorMessage = (blankIndex: number, validatorIndex: number, message: string) => {
        const newValidators = JSON.parse(JSON.stringify(params.validators));
        newValidators[blankIndex][validatorIndex].errorMessage = message;
        setParams(prev => ({ ...prev, validators: newValidators }));
    };

    return (
        <Form layout="vertical" style={{ width: '100%' }}>
            {/* 基本信息 */}
            <Form.Item label="题目标题" required>
                <Input
                    value={params.title}
                    onChange={(e) => handleBasicChange('title', e.target.value)}
                />
            </Form.Item>

            <Form.Item label="题目描述">
                <TextArea
                    value={params.description || ''}
                    onChange={(e) => handleBasicChange('description', e.target.value)}
                    rows={4}
                />
            </Form.Item>

            <Form.Item label="必答题">
                <Switch
                    checked={params.isRequired}
                    onChange={(checked) => handleBasicChange('isRequired', checked)}
                />
            </Form.Item>

            {/* 填空题特有设置 */}
            <Divider orientation="left">填空题设置</Divider>

            <Form.Item label="填空数量" required>
                <InputNumber
                    min={1}
                    value={params.blankCount}
                    onChange={(value) => handleBlankCountChange(value as number)}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="答案类型" required>
                <Select
                    value={params.answerType}
                    onChange={(value) => handleBasicChange('answerType', value)}
                    style={{ width: '100%' }}
                >
                    <Option value="text">文本</Option>
                    <Option value="number">数字</Option>
                </Select>
            </Form.Item>

            <Form.Item label="占位符文本">
                <Input
                    value={params.placeholder}
                    onChange={(e) => handleBasicChange('placeholder', e.target.value)}
                />
            </Form.Item>

            <Form.Item label="行内填空模式">
                <Switch
                    checked={params.inlineMode}
                    onChange={(checked) => handleBasicChange('inlineMode', checked)}
                />
            </Form.Item>

            {params.inlineMode && (
                <Form.Item label="行内文本 (使用 {{blank}} 标记填空位置)">
                    <TextArea
                        value={params.inlineText || ''}
                        onChange={(e) => handleBasicChange('inlineText', e.target.value)}
                        placeholder="例如：北京是{{blank}}的首都。"
                        rows={4}
                    />
                </Form.Item>
            )}

            {/* 填空详细设置 */}
            <Divider orientation="left">填空详细设置</Divider>

            <Collapse defaultActiveKey={['0']}>
                {Array.from({ length: params.blankCount }).map((_, blankIndex) => (
                    <Panel
                        header={params.blankLabels[blankIndex] || `填空 ${blankIndex + 1}`}
                        key={blankIndex.toString()}
                    >
                        <Form.Item label="填空标签">
                            <Input
                                value={params.blankLabels[blankIndex]}
                                onChange={(e) => handleBlankLabelChange(blankIndex, e.target.value)}
                            />
                        </Form.Item>

                        {/* 正确答案设置 */}
                        <Form.Item label="正确答案">
                            {params.correctAnswers[blankIndex].map((answer, answerIndex) => (
                                <Space key={answerIndex} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Input
                                        value={answer}
                                        onChange={(e) => handleCorrectAnswerChange(blankIndex, answerIndex, e.target.value)}
                                        placeholder="输入正确答案"
                                    />
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeCorrectAnswer(blankIndex, answerIndex)}
                                    />
                                </Space>
                            ))}
                            <Button
                                type="dashed"
                                onClick={() => addCorrectAnswer(blankIndex)}
                                icon={<PlusOutlined />}
                                style={{ width: '100%', marginTop: 8 }}
                            >
                                添加正确答案
                            </Button>
                        </Form.Item>

                        {/* 验证器设置 */}
                        <Form.Item label="验证规则">
                            {params.validators[blankIndex].map((validator, validatorIndex) => (
                                <Card
                                    key={validatorIndex}
                                    size="small"
                                    style={{ marginBottom: 16 }}
                                    title={`验证规则 ${validatorIndex + 1}`}
                                    extra={
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeValidator(blankIndex, validatorIndex)}
                                        />
                                    }
                                >
                                    <Form.Item label="错误提示信息">
                                        <Input
                                            value={validator.errorMessage || ''}
                                            onChange={(e) => updateValidatorErrorMessage(blankIndex, validatorIndex, e.target.value)}
                                        />
                                    </Form.Item>
                                </Card>
                            ))}
                            <Form.Item label="添加验证规则">
                                <Row gutter={[8, 8]}>
                                    <Col><Button onClick={() => addValidator(blankIndex, 'required')}>必填</Button></Col>
                                    <Col><Button onClick={() => addValidator(blankIndex, 'minLength')}>最小长度</Button></Col>
                                    <Col><Button onClick={() => addValidator(blankIndex, 'maxLength')}>最大长度</Button></Col>
                                    <Col><Button onClick={() => addValidator(blankIndex, 'minValue')}>最小值</Button></Col>
                                    <Col><Button onClick={() => addValidator(blankIndex, 'maxValue')}>最大值</Button></Col>
                                    <Col><Button onClick={() => addValidator(blankIndex, 'regex')}>正则表达式</Button></Col>
                                    <Col><Button onClick={() => addValidator(blankIndex, 'custom')}>自定义</Button></Col>
                                </Row>
                            </Form.Item>
                        </Form.Item>
                    </Panel>
                ))}
            </Collapse>
        </Form>
    );
};

export default InputEdit;