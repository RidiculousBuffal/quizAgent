import React from 'react';
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

const { TextArea } = Input;
const { Option } = Select;

interface InputEditProps {
    question: FillBlankQuestion;
    onChange: (question: FillBlankQuestion) => void;
}

const InputEdit: React.FC<InputEditProps> = ({ question, onChange }) => {
    /** 工具函数，生成新的 FillBlankQuestion */
    function updateQuestion(newProps: Partial<FillBlankParams>) {
        onChange(new FillBlankQuestion({ ...question, ...newProps }))
    }
    // 填空数量的变化及数组自动补齐/裁剪
    const handleBlankCountChange = (value: number) => {
        const newCount = Math.max(1, value || 1);

        // 补齐/裁剪 blankLabels
        const blankLabels = [...question.blankLabels];
        while (blankLabels.length < newCount) blankLabels.push(`填空 ${blankLabels.length + 1}`);
        blankLabels.length = newCount;

        const correctAnswers = JSON.parse(JSON.stringify(question.correctAnswers));
        while (correctAnswers.length < newCount) correctAnswers.push([]);
        correctAnswers.length = newCount;

        updateQuestion({
            blankCount: newCount,
            blankLabels,
            correctAnswers,
        });
    };

    const handleBasicChange = (field: keyof FillBlankParams, value: any) => {
        updateQuestion({ [field]: value } as any);
    };

    const handleBlankLabelChange = (index: number, value: string) => {
        const blankLabels = [...question.blankLabels];
        blankLabels[index] = value;
        updateQuestion({ blankLabels });
    };

    const handleCorrectAnswerChange = (blankIndex: number, answerIndex: number, value: string) => {
        const correctAnswers = JSON.parse(JSON.stringify(question.correctAnswers));
        correctAnswers[blankIndex][answerIndex] = value;
        updateQuestion({ correctAnswers });
    };

    const addCorrectAnswer = (blankIndex: number) => {
        const correctAnswers = JSON.parse(JSON.stringify(question.correctAnswers));
        correctAnswers[blankIndex].push('');
        updateQuestion({ correctAnswers });
    };

    const removeCorrectAnswer = (blankIndex: number, answerIndex: number) => {
        const correctAnswers = JSON.parse(JSON.stringify(question.correctAnswers));
        correctAnswers[blankIndex].splice(answerIndex, 1);
        updateQuestion({ correctAnswers });
    };

    return (
        <Form layout="vertical" style={{ width: '100%' }}>
            {/* 基本信息 */}
            <Form.Item label="题目标题" required>
                <Input
                    value={question.title}
                    onChange={(e) => handleBasicChange('title', e.target.value)}
                />
            </Form.Item>

            <Form.Item label="题目描述">
                <TextArea
                    value={question.description || ''}
                    onChange={(e) => handleBasicChange('description', e.target.value)}
                    rows={4}
                />
            </Form.Item>

            <Form.Item label="必答题">
                <Switch
                    checked={question.isRequired}
                    onChange={(checked) => handleBasicChange('isRequired', checked)}
                />
            </Form.Item>

            {/* 填空题特有设置 */}
            <Divider orientation="left">填空题设置</Divider>

            <Form.Item label="填空数量" required>
                <InputNumber
                    min={1}
                    value={question.blankCount}
                    onChange={(value) => handleBlankCountChange(value as number)}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="答案类型" required>
                <Select
                    value={question.answerType}
                    onChange={(value) => handleBasicChange('answerType', value)}
                    style={{ width: '100%' }}
                >
                    <Option value="text">文本</Option>
                    <Option value="number">数字</Option>
                </Select>
            </Form.Item>

            <Form.Item label="占位符文本">
                <Input
                    value={question.placeholder}
                    onChange={(e) => handleBasicChange('placeholder', e.target.value)}
                />
            </Form.Item>

            <Form.Item label="行内填空模式">
                <Switch
                    checked={question.inlineMode}
                    onChange={(checked) => handleBasicChange('inlineMode', checked)}
                />
            </Form.Item>

            {question.inlineMode && (
                <Form.Item label="行内文本 (使用 {{blank}} 标记填空位置)">
                    <TextArea
                        value={question.inlineText || ''}
                        onChange={(e) => handleBasicChange('inlineText', e.target.value)}
                        placeholder="例如：北京是{{blank}}的首都。"
                        rows={4}
                    />
                </Form.Item>
            )}

            {/* 填空详细设置 */}
            <Divider orientation="left">填空详细设置</Divider>

            <Collapse
                defaultActiveKey={['0']}
                items={Array.from({ length: question.blankCount }).map((_, blankIndex) => ({
                    key: blankIndex.toString(),
                    label: question.blankLabels[blankIndex] || `填空 ${blankIndex + 1}`,
                    children: (
                        <>
                            <Form.Item label="填空标签">
                                <Input
                                    value={question.blankLabels[blankIndex]}
                                    onChange={(e) => handleBlankLabelChange(blankIndex, e.target.value)}
                                />
                            </Form.Item>

                            {/* 正确答案设置 */}
                            <Form.Item label="正确答案">
                                {question.correctAnswers[blankIndex].map((answer: string, answerIndex: number) => (
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
                        </>
                    )
                }))}
            />
        </Form>
    );
};

export default InputEdit;