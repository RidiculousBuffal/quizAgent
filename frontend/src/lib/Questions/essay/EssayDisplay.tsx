import React, { useEffect, useRef, Fragment, useCallback, useState } from 'react';
import { Typography, Card } from 'antd';
import ReactMarkdown from 'react-markdown';
import { EssayQuestion } from './essay';
import { BaseDisplayParams } from '../BaseQuestion';
import './essay.css';
import katex from 'katex';
import 'katex/dist/katex.css';
import mermaid from 'mermaid';
import { getCodeString } from 'rehype-rewrite';

const { Title, Text } = Typography;

// 创建随机ID的辅助函数
const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

// 定义代码组件的参数类型
interface CodeProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    node?: any;
    [key: string]: any;
}

// 自定义代码组件，用于渲染KaTeX和Mermaid
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

interface EssayDisplayProps extends BaseDisplayParams {
    question: EssayQuestion;
    answer: string;
}

const EssayDisplay: React.FC<EssayDisplayProps> = ({ question, answer }) => {
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

    return (
        <div className="essay-display">
            <div className="question-title">
                <Title level={4}>{question.title}</Title>
                {question.isRequired && <span className="required-mark">*</span>}
            </div>

            {question.description && (
                <div className="question-description">
                    <Text type="secondary">{question.description}</Text>
                </div>
            )}

            <Card
                className="answer-card"
                style={{
                    marginTop: '12px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                }}
            >
                {question.allowMarkdown ? (
                    <div className="markdown-display">
                        <ReactMarkdown
                            components={{
                                code: CustomCode
                            }}
                        >
                            {answer || ''}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="text-display" style={{ whiteSpace: 'pre-wrap' }}>
                        {answer || ''}
                    </div>
                )}

                {!question.hideWordCount && (
                    <div className="word-count" style={{
                        textAlign: 'right',
                        marginTop: '8px',
                        color: 'rgba(0, 0, 0, 0.45)',
                        fontSize: '12px'
                    }}>
                        共 {answer ? answer.length : 0} 字
                    </div>
                )}
            </Card>
        </div>
    );
};

export default EssayDisplay;