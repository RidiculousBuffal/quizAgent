import React, { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import {
    Typography,
    Alert,
    Card,
    Input
} from 'antd';
import MDEditor from '@uiw/react-md-editor';
import { EssayQuestion } from './essay';
import { BaseQuestionPreviewParams } from '../BaseQuestion';
import './essay.css';
import katex from 'katex';
import 'katex/dist/katex.css';
import mermaid from 'mermaid';
import { getCodeString } from 'rehype-rewrite';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

// 添加卡片样式
const cardStyle = {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    borderRadius: '8px',
    marginBottom: '20px',
    overflow: 'hidden'
};

const cardHeaderStyle = {
    padding: '16px 24px',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fafafa'
};

const cardBodyStyle = {
    padding: '20px 24px'
};

// 创建随机ID的辅助函数，用于Mermaid图表渲染
const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

// 定义代码组件的参数类型
interface CodeProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    node?: any;
    [key: string]: any;
}

// 自定义代码渲染组件，支持KaTeX和Mermaid
const CustomCode: React.FC<CodeProps> = ({ inline, className, children, ...props }) => {
    const demoid = useRef<string>(`mermaid-${randomid()}`);
    const [container, setContainer] = useState<HTMLElement | null>(null);

    // 检查是否是Mermaid代码块
    const isMermaid = className && /^language-mermaid/i.test(className);

    // 获取代码内容
    let code = '';
    if (typeof children === 'string') {
        code = children;
    } else if (props.node && props.node.children) {
        code = getCodeString(props.node.children);
    } else if (Array.isArray(children) && children.length > 0) {
        code = String(children[0] || '');
    }

    // 检查是否是LaTeX数学公式
    const isKatex = typeof code === 'string' &&
        ((className && /^language-katex/i.test(className)) ||
            /^\$\$(.*)\$\$/.test(code));

    // 当容器挂载且内容为Mermaid图表时渲染
    useEffect(() => {
        if (container && isMermaid && demoid.current && code) {
            try {
                mermaid.render(demoid.current, code)
                    .then(({ svg, bindFunctions }) => {
                        if (container) {
                            container.innerHTML = svg;
                            if (bindFunctions) bindFunctions(container);
                        }
                    })
                    .catch(error => {
                        console.error("Mermaid rendering error:", error);
                        if (container) {
                            container.innerHTML = `<div class="error-message">图表渲染错误: ${error.message || '未知错误'}</div>`;
                        }
                    });
            } catch (error) {
                console.error("Mermaid general error:", error);
            }
        }
    }, [container, isMermaid, code]);

    // 处理KaTeX数学公式
    if (isKatex) {
        let formula = code;
        if (/^\$\$(.*)\$\$/.test(code)) {
            formula = code.replace(/^\$\$(.*)\$\$/s, '$1');
        }

        try {
            const html = katex.renderToString(formula, {
                throwOnError: false,
                displayMode: !inline
            });
            return <code dangerouslySetInnerHTML={{ __html: html }} style={{ background: 'transparent', fontSize: '120%' }} />;
        } catch (error) {
            console.error("KaTeX rendering error:", error);
            return <code className="katex-error">公式渲染错误</code>;
        }
    }

    // 处理回调引用
    const refElement = useCallback((node: HTMLElement | null) => {
        if (node !== null) {
            setContainer(node);
        }
    }, []);

    // 渲染Mermaid图表
    if (isMermaid) {
        return (
            <Fragment>
                <code id={demoid.current} style={{ display: "none" }} />
                <div
                    className="mermaid-container"
                    ref={refElement}
                    style={{
                        background: '#f8f9fa',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '16px'
                    }}
                />
            </Fragment>
        );
    }

    // 默认代码渲染
    return <code className={className}>{children}</code>;
};

interface EssayPreviewProps extends BaseQuestionPreviewParams {
    question: EssayQuestion;
}

const EssayPreview: React.FC<EssayPreviewProps> = ({
                                                       question,
                                                       value,
                                                       onChange,
                                                       showValidation = false
                                                   }) => {
    // 初始化答案状态
    const [answer, setAnswer] = useState<string>(() => {
        if (typeof value === 'string') {
            return value;
        }
        return question?.initialTemplate || '';
    });

    // 验证结果状态
    const [validationResult, setValidationResult] = useState<{ isValid: boolean; message?: string } | boolean>(true);

    // 用于追踪问题ID的ref
    const questionIdRef = useRef<number>(question?.id);

    // 初始化mermaid
    useEffect(() => {
        try {
            mermaid.initialize({
                startOnLoad: true,
                theme: 'default',
                logLevel: 'error',
                securityLevel: 'loose',
                flowchart: { htmlLabels: true, curve: 'basis' },
                fontSize: 16
            });
        } catch (error) {
            console.error("Mermaid initialization error:", error);
        }
    }, []);

    // 当问题ID变化或value变化时，重置内部状态
    useEffect(() => {
        // 检测到新问题
        if (questionIdRef.current !== question?.id) {
            questionIdRef.current = question?.id;

            // 初始化答案
            if (typeof value === 'string') {
                setAnswer(value);
            } else {
                setAnswer(question?.initialTemplate || '');
            }
            return;
        }

        // 外部value更新
        if (typeof value === 'string' && value !== answer) {
            setAnswer(value);
        }
    }, [value, question?.id, question?.initialTemplate, answer]);

    // 验证逻辑
    useEffect(() => {
        if (showValidation && typeof question?.validate === 'function') {
            try {
                const result = question.validate(answer);
                setValidationResult(result);
            } catch (error) {
                console.error('Validation error:', error);
                setValidationResult({ isValid: false, message: '验证过程出错' });
            }
        }
    }, [answer, question, showValidation]);

    // 用户更改答案的处理函数
    const handleAnswerChange = (newValue: string | undefined) => {
        const updatedValue = newValue || '';

        // 更新内部状态
        setAnswer(updatedValue);

        // 通知父组件
        if (onChange) {
            onChange(updatedValue);
        }
    };

    // 计算当前字数
    const currentLength = answer ? answer.length : 0;

    // 字数提示文本
    const getWordCountText = () => {
        let text = `当前字数: ${currentLength}`;

        if (question.minLength && question.maxLength) {
            text += ` (要求: ${question.minLength}-${question.maxLength}字)`;
        } else if (question.minLength) {
            text += ` (最少: ${question.minLength}字)`;
        } else if (question.maxLength) {
            text += ` (最多: ${question.maxLength}字)`;
        }

        return text;
    };

    // 配置预览选项，支持KaTeX和Mermaid
    const previewOptions = {
        components: {
            code: CustomCode
        }
    };

    return (
        <div className="question-preview-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Card style={cardStyle} variant={"borderless"}>
                <div style={cardHeaderStyle}>
                    <Title level={4} style={{ margin: 0, fontSize: '18px' }}>{question.title}</Title>
                    {question.description && (
                        <Paragraph type="secondary" style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                            {question.description}
                        </Paragraph>
                    )}
                    {question.isRequired && (
                        <Text type="danger" style={{ fontSize: '13px', marginTop: '4px', display: 'block' }}>
                            * 此题为必答题
                        </Text>
                    )}
                </div>
                <div style={cardBodyStyle}>
                    {/* Markdown编辑器或普通文本区 */}
                    {question.allowMarkdown ? (
                        <div className="markdown-editor-container">
                            <div className="markdown-features-hint" style={{ marginBottom: '12px' }}>
                                <Text type="secondary" style={{ fontSize: '13px' }}>
                                    支持Markdown格式、数学公式($E=mc^2$)和图表
                                </Text>
                            </div>
                            <div data-color-mode='light'>
                                <MDEditor
                                    value={answer}
                                    onChange={handleAnswerChange}
                                    height={300}
                                    visibleDragbar={true}
                                    textareaProps={{placeholder:question.placeholder}}
                                    previewOptions={previewOptions}
                                />
                            </div>
                            {!question.hideWordCount && (
                                <div className="word-count" style={{
                                    textAlign: 'right',
                                    marginTop: '8px',
                                    color: 'rgba(0, 0, 0, 0.45)',
                                    fontSize: '14px'
                                }}>
                                    {getWordCountText()}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="textarea-container">
                            <TextArea
                                value={answer}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                placeholder={question.placeholder}
                                rows={10}
                                style={{ width: '100%', resize: 'vertical' }}
                            />
                            {!question.hideWordCount && (
                                <div className="word-count" style={{
                                    textAlign: 'right',
                                    marginTop: '8px',
                                    color: 'rgba(0, 0, 0, 0.45)',
                                    fontSize: '14px'
                                }}>
                                    {getWordCountText()}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 验证错误提示 */}
                    {showValidation && typeof validationResult !== 'boolean' && !validationResult.isValid && (
                        <Alert
                            message={validationResult.message || '输入有误，请检查'}
                            type="error"
                            showIcon
                            style={{ marginTop: 16, borderRadius: '4px' }}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default EssayPreview;