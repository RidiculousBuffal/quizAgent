import React from 'react';
import {
    Form,
    Input,
    InputNumber,
    Switch,
    Card,
    Typography,
    Row,
    Col,
    Tabs
} from 'antd';
import MDEditor from '@uiw/react-md-editor';
import { EssayQuestion, EssayQuestionParams } from './essay';
import katex from 'katex';
import 'katex/dist/katex.css';
import mermaid from 'mermaid';
import { getCodeString } from 'rehype-rewrite';

const { TextArea } = Input;
const { Title } = Typography;
const { TabPane } = Tabs;

// 卡片样式
const cardStyle = {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    marginBottom: '20px',
    overflow: 'hidden'
};

const cardHeaderStyle = {
    backgroundColor: '#f5f5f5',
    padding: '12px 16px',
    borderBottom: '1px solid #e8e8e8'
};

const cardBodyStyle = {
    padding: '16px'
};

const sectionStyle = {
    marginBottom: '24px'
};

// 创建一个帮助卡片组件，显示KaTeX和Mermaid的使用示例
const HelpCard = () => (
    <Card size="small" title="Markdown增强功能使用示例" style={{ marginBottom: '16px' }}>
        <Tabs defaultActiveKey="1">
            <TabPane tab="KaTeX数学公式" key="1">
                <pre style={{ background: '#f6f8fa', padding: '12px', borderRadius: '4px' }}>
                    {`行内公式: $E = mc^2$

块级公式: 
$$
\\frac{n!}{k!(n-k)!} = \\binom{n}{k}
$$

或者使用代码块:
\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\``}
                </pre>
            </TabPane>
            <TabPane tab="Mermaid图表" key="2">
                <pre style={{ background: '#f6f8fa', padding: '12px', borderRadius: '4px' }}>
                    {`流程图:
\`\`\`mermaid
graph TD
A[开始] -->|处理| B(过程)
B --> C{决策?}
C -->|是| D[结果1]
C -->|否| E[结果2]
\`\`\`

时序图:
\`\`\`mermaid
sequenceDiagram
参与者A->>参与者B: 问候
参与者B-->>参与者A: 回应
\`\`\``}
                </pre>
            </TabPane>
        </Tabs>
    </Card>
);

// 定义代码组件的参数类型
interface CodeComponentProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    node?: any;
    [key: string]: any;
}

interface EssayEditProps {
    question: EssayQuestion;
    onChange: (question: EssayQuestion) => void;
}

const EssayEdit: React.FC<EssayEditProps> = ({ question, onChange }) => {
    // 更新问题的工具函数
    function updateQuestion(newProps: Partial<EssayQuestionParams>) {
        onChange(new EssayQuestion({ ...question, ...newProps }));
    }

    // 基本属性变更处理函数
    const handleBasicChange = (field: keyof EssayQuestionParams, value: any) => {
        updateQuestion({ [field]: value } as any);
    };

    // 随机ID生成函数
    const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

    // 为Markdown编辑器配置KaTeX和Mermaid支持
    const previewOptions = {
        components: {
            code: ({ inline, className, children, ...props }: CodeComponentProps) => {
                // 处理KaTeX行内公式
                if (typeof children === 'string' && /^\$\$(.*)\$\$/.test(children)) {
                    const formula = children.replace(/^\$\$(.*)\$\$/, '$1');
                    try {
                        const html = katex.renderToString(formula, {
                            throwOnError: false,
                        });
                        return <code dangerouslySetInnerHTML={{ __html: html }} style={{ background: 'transparent' }} />;
                    } catch (error) {
                        console.error('KaTeX error:', error);
                        return <code>Error rendering formula</code>;
                    }
                }

                // 获取代码内容
                let code = '';
                if (typeof children === 'string') {
                    code = children;
                } else if (props.node && props.node.children) {
                    code = getCodeString(props.node.children);
                } else if (Array.isArray(children) && children.length > 0) {
                    code = String(children[0] || '');
                }

                // 处理KaTeX代码块
                if (
                    typeof className === 'string' &&
                    /^language-katex/i.test(className)
                ) {
                    try {
                        const html = katex.renderToString(code, {
                            throwOnError: false,
                        });
                        return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
                    } catch (error) {
                        console.error('KaTeX error:', error);
                        return <code>Error rendering formula</code>;
                    }
                }

                // 处理Mermaid图表
                if (
                    typeof className === 'string' &&
                    /^language-mermaid/i.test(className)
                ) {
                    const id = `mermaid-${randomid()}`;

                    // 使用setTimeout避免渲染问题
                    setTimeout(() => {
                        try {
                            mermaid.render(id, code).then(({ svg }) => {
                                const element = document.getElementById(id);
                                if (element) {
                                    element.innerHTML = svg;
                                }
                            }).catch(error => {
                                console.error("Mermaid rendering error:", error);
                                const element = document.getElementById(id);
                                if (element) {
                                    element.innerHTML = "Error rendering diagram";
                                }
                            });
                        } catch (error) {
                            console.error("Mermaid error:", error);
                        }
                    }, 0);

                    return <div id={id} className="mermaid-diagram" />;
                }

                // 默认代码渲染
                return <code className={className}>{children}</code>;
            },
        },
    };

    return (
        <div className="question-editor-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Card style={cardStyle}>
                <div style={cardHeaderStyle}>
                    <Title level={4} style={{ margin: 0 }}>简答题编辑</Title>
                </div>
                <div style={cardBodyStyle}>
                    <Form layout="vertical" style={{ width: '100%' }}>
                        {/* 基本信息 */}
                        <div style={sectionStyle}>
                            <Title level={5}>基本信息</Title>
                            <Row gutter={16}>
                                <Col span={16}>
                                    <Form.Item label="题目标题" required>
                                        <Input
                                            value={question.title}
                                            onChange={(e) => handleBasicChange('title', e.target.value)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="必答题">
                                        <Switch
                                            checked={question.isRequired}
                                            onChange={(checked) => handleBasicChange('isRequired', checked)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="题目描述">
                                <TextArea
                                    value={question.description || ''}
                                    onChange={(e) => handleBasicChange('description', e.target.value)}
                                    rows={4}
                                />
                            </Form.Item>
                        </div>

                        {/* 简答题特有设置 */}
                        <div style={sectionStyle}>
                            <Title level={5}>简答题设置</Title>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="最小字数">
                                        <InputNumber
                                            min={0}
                                            value={question.minLength}
                                            onChange={(value) => handleBasicChange('minLength', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="最大字数">
                                        <InputNumber
                                            min={0}
                                            value={question.maxLength}
                                            onChange={(value) => handleBasicChange('maxLength', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item label="占位文本">
                                        <Input
                                            value={question.placeholder}
                                            onChange={(e) => handleBasicChange('placeholder', e.target.value)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="启用Markdown编辑器">
                                        <Switch
                                            checked={question.allowMarkdown}
                                            onChange={(checked) => handleBasicChange('allowMarkdown', checked)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="隐藏字数统计">
                                        <Switch
                                            checked={question.hideWordCount}
                                            onChange={(checked) => handleBasicChange('hideWordCount', checked)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="初始模板(提供给回答者的初始文本)">
                                {question.allowMarkdown ? (
                                    <div data-color-mode="light">
                                        <HelpCard />
                                        <MDEditor
                                            value={question.initialTemplate || ''}
                                            onChange={(value) => handleBasicChange('initialTemplate', value)}
                                            height={300}
                                            preview="edit"
                                            previewOptions={previewOptions}
                                        />
                                    </div>
                                ) : (
                                    <TextArea
                                        value={question.initialTemplate || ''}
                                        onChange={(e) => handleBasicChange('initialTemplate', e.target.value)}
                                        rows={6}
                                        placeholder="输入一个初始模板文本..."
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default EssayEdit;