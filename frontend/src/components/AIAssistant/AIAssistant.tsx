import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {Bubble} from '@ant-design/x';
import {Sender} from '@ant-design/x';
import {Card, Typography, Select, Space, Flex, Badge, Button, Divider, Spin, Tooltip, Tag, GetProp} from 'antd';
import {
    RobotOutlined,
    UserOutlined,
    CloseOutlined,
    ApiOutlined,
    CheckCircleOutlined,
    CheckSquareOutlined,
    FormOutlined
} from '@ant-design/icons';
import {useQuizStore} from '../../store/quiz/QuizStore';
import {getAllQuestionsInQuiz} from '../../api/questionapi';
import message from '../../components/globalMessage/index';
import {BASE_URL} from '../../api/base.ts';
import {useUserStore} from '../../store/user/UserStore';
import MarkdownIt from 'markdown-it';
import {getAIGenerationHistory} from "../../api/aigenerationapi.ts";

const {Text, Title, Paragraph} = Typography;
const md = new MarkdownIt();

// 定义消息类型
interface Message {
    role: 'ai' | 'user' | 'tool';
    content: string;
    key: string | number;
}


// 工具调用组件
const ToolCallMessage: React.FC<{ tool: string; result?: any }> = ({tool, result}) => {
    // 根据工具名称确定工具类型和显示信息
    const getToolInfo = () => {
        if (tool.includes('Radio')) {
            return {
                type: '单选题',
                color: '#1677ff',
                icon: <CheckCircleOutlined/>,
                title: result?.title || '单选题'
            };
        } else if (tool.includes('CheckBox')) {
            return {
                type: '多选题',
                color: '#52c41a',
                icon: <CheckSquareOutlined/>,
                title: result?.title || '多选题'
            };
        } else if (tool.includes('FillBlank')) {
            return {
                type: '填空题',
                color: '#faad14',
                icon: <FormOutlined/>,
                title: result?.title || '填空题'
            };
        } else {
            return {
                type: '题目',
                color: '#722ed1',
                icon: <ApiOutlined/>,
                title: '题目已创建'
            };
        }
    };

    const toolInfo = getToolInfo();

    // 提取选项信息（适用于单选和多选题）
    const getOptionsText = () => {
        if (!result?.options || !Array.isArray(result.options)) return null;

        return (
            <Paragraph type="secondary" style={{fontSize: '12px', margin: 0, marginTop: 4}}>
                选项: {result.options.map((opt: any) => opt.text).join(', ')}
            </Paragraph>
        );
    };

    return (
        <Card
            size="small"
            style={{
                marginBottom: 8,
                background: '#f8f8f8',
                borderLeft: `3px solid ${toolInfo.color}`,
            }}
            bodyStyle={{padding: '8px 12px'}}
        >
            <Space direction="vertical" size={0} style={{width: '100%'}}>
                <Flex align="center">
                    {toolInfo.icon}
                    <Tooltip title="点击问题列表查看详情">
                        <Tag color={toolInfo.color} style={{margin: '0 8px'}}>
                            {toolInfo.type}
                        </Tag>
                    </Tooltip>
                    <Text strong style={{fontSize: '14px'}}>{toolInfo.title}</Text>
                </Flex>
                {result?.description && (
                    <Text type="secondary" style={{fontSize: '12px', display: 'block', marginTop: 2}}>
                        {result.description}
                    </Text>
                )}
                {getOptionsText()}
            </Space>
        </Card>
    );
};

// 检测是否是工具调用JSON
const isToolCallJson = (text: string) => {
    try {
        if (!text) return false;
        const trimmed = text.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            const data = JSON.parse(trimmed);
            return data.type === 'toolCall' || (data.tool !== undefined);
        }
        return false;
    } catch (e) {
        return false;
    }
};

// 从老格式中提取工具名称
const extractToolName = (text: string) => {
    const matches = text.match(/\[ToolCall\] (\S+) &rarr;/);
    return matches ? matches[1] : '';
};

// 获取AI生成历史


// 主组件
const AIAssistant: React.FC<{ onClose?: () => void }> = ({onClose}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modelName, setModelName] = useState('gpt-4.1');
    const [needRefresh, setNeedRefresh] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [showLoadingSpinner, setShowLoadingSpinner] = useState(false); // 新增：延迟显示加载状态
    const bubbleListRef = useRef<any>(null);
    const currentQuizId = useQuizStore((q) => q.curEditQuizId);

    // 渲染Markdown内容 - 使用useCallback缓存
    const renderMarkdown = useCallback((content: string) => {
        if (!content) return null;
        return <div dangerouslySetInnerHTML={{__html: md.render(content)}}/>;
    }, []);

    // 设置欢迎消息 - 使用useCallback包装
    const setWelcomeMessage = useCallback(() => {
        setMessages([{
            role: 'ai',
            content: '👋 我是你的问卷设计助手，可以帮你生成各种类型的问卷题目。请告诉我你想创建什么主题的问卷，需要包含哪些类型的问题，我将为你自动生成相关题目。',
            key: 'welcome',
        }]);
    }, []);

    // 渲染消息内容 - 使用useCallback包装
    const renderMessage = useCallback((content: string, role: string) => {
        if (role === 'tool') {
            try {
                // 尝试解析为新格式JSON
                if (content.startsWith('{') && content.endsWith('}')) {
                    const toolData = JSON.parse(content);
                    return (
                        <ToolCallMessage
                            tool={toolData.tool || ''}
                            result={toolData.result}
                        />
                    );
                }

                // 尝试解析旧格式
                if (content.includes('[ToolCall]')) {
                    const toolName = extractToolName(content);

                    // 尝试提取JSON部分
                    const jsonMatch = content.match(/&rarr; (.+)$/);
                    if (jsonMatch && jsonMatch[1]) {
                        try {
                            const jsonString = jsonMatch[1].replace(/^"/, '').replace(/"$/, '');
                            const jsonData = JSON.parse(jsonString);
                            return (
                                <ToolCallMessage
                                    tool={toolName}
                                    result={jsonData}
                                />
                            );
                        } catch (e) {
                            // JSON解析失败，返回简单工具调用
                            return <ToolCallMessage tool={toolName}/>;
                        }
                    }

                    // 无法提取JSON，返回简单工具调用
                    return <ToolCallMessage tool={toolName}/>;
                }
            } catch (e) {
                console.error('Failed to parse tool message:', e);
                // 都解析失败了，返回简单提示
                return (
                    <Card size="small" style={{marginBottom: 8, background: '#f8f8f8'}}>
                        <Text type="secondary">题目已创建</Text>
                    </Card>
                );
            }
        }

        // 常规markdown渲染
        return renderMarkdown(content);
    }, [renderMarkdown]);

    // 加载历史记录 - 使用useCallback包装
    const loadChatHistory = useCallback(async () => {
        if (!currentQuizId || isLoadingHistory) return;

        setIsLoadingHistory(true);
        try {
            const history = await getAIGenerationHistory(currentQuizId);
            if (history && history.length > 0) {
                const historyMessages: Message[] = [];

                history.forEach((item, index) => {
                    // 添加用户问题
                    if (item.inputPrompt) {
                        const userPrompt = item.inputPrompt.includes('User: ')
                            ? item.inputPrompt.split('User: ')[1]
                            : item.inputPrompt;

                        historyMessages.push({
                            role: 'user',
                            content: userPrompt,
                            key: `history-user-${index}`,
                        });
                    }

                    // 添加AI回答
                    if (item.generatedResult) {
                        try {
                            // 尝试解析新的结构化JSON格式
                            const resultData = JSON.parse(item.generatedResult);

                            // 处理新格式：包含text和toolCalls字段
                            if (resultData.text !== undefined || resultData.toolCalls !== undefined) {
                                // 添加普通文本内容
                                if (resultData.text && resultData.text.trim()) {
                                    historyMessages.push({
                                        role: 'ai',
                                        content: resultData.text,
                                        key: `history-ai-${index}`,
                                    });
                                }

                                // 添加工具调用
                                if (resultData.toolCalls && resultData.toolCalls.length > 0) {
                                    resultData.toolCalls.forEach((tool: any, toolIdx: number) => {
                                        historyMessages.push({
                                            role: 'tool',
                                            content: JSON.stringify(tool),
                                            key: `history-tool-${index}-${toolIdx}`,
                                        });
                                    });
                                }
                            }
                            // 处理旧格式：aiResponse字段
                            else if (resultData.aiResponse) {
                                const aiResponse = resultData.aiResponse;

                                // 检查是否包含工具调用
                                if (aiResponse.includes('[ToolCall]')) {
                                    // 分离工具调用和普通文本
                                    const parts = aiResponse.split('[ToolCall]');

                                    // 添加普通文本部分
                                    if (parts[0].trim()) {
                                        historyMessages.push({
                                            role: 'ai',
                                            content: parts[0].trim(),
                                            key: `history-ai-${index}`,
                                        });
                                    }

                                    // 添加工具调用部分
                                    parts.slice(1).forEach((part: string, toolIdx: number) => {
                                        if (part.trim()) {
                                            historyMessages.push({
                                                role: 'tool',
                                                content: `[ToolCall] ${part}`,
                                                key: `history-tool-${index}-${toolIdx}`,
                                            });
                                        }
                                    });
                                } else {
                                    // 纯文本响应
                                    historyMessages.push({
                                        role: 'ai',
                                        content: aiResponse,
                                        key: `history-ai-${index}`,
                                    });
                                }
                            } else {
                                // 直接显示JSON数据
                                historyMessages.push({
                                    role: 'ai',
                                    content: item.generatedResult,
                                    key: `history-ai-${index}`,
                                });
                            }
                        } catch (e) {
                            // JSON解析失败，直接作为文本显示
                            historyMessages.push({
                                role: 'ai',
                                content: item.generatedResult,
                                key: `history-ai-${index}`,
                            });
                        }
                    }
                });

                if (historyMessages.length > 0) {
                    setMessages(historyMessages);
                } else {
                    setWelcomeMessage();
                }
            } else {
                setWelcomeMessage();
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
            setWelcomeMessage();
        } finally {
            setIsLoadingHistory(false);
        }
    }, [currentQuizId, isLoadingHistory, setWelcomeMessage]);

    // 刷新问题列表 - 使用useCallback包装
    const refreshQuestions = useCallback(async () => {
        if (needRefresh && currentQuizId) {
            try {
                const result = await getAllQuestionsInQuiz(currentQuizId);
                if (result) {
                    message.success('问题已生成并添加到列表中');
                    setNeedRefresh(false);
                }
            } catch (error) {
                console.error('Failed to refresh questions:', error);
            }
        }
    }, [needRefresh, currentQuizId]);

    // 处理流式响应 - 使用useCallback包装
    const handleStreamResponse = useCallback(async (stream: ReadableStream<Uint8Array>, aiMessageKey: string) => {
        if (!stream) return;

        const reader = stream.getReader();
        const decoder = new TextDecoder();

        let textBuffer = '';
        let jsonBuffer = '';
        let isInJsonBlock = false;
        let jsonBlockDepth = 0;

        // 收集工具消息，以便批量更新
        const toolMessages: Message[] = [];

        try {
            while (true) {
                const {value, done} = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, {stream: true});

                // 逐字符处理，更精确地识别JSON块
                for (let i = 0; i < chunk.length; i++) {
                    const char = chunk[i];

                    if (char === '{' && !isInJsonBlock) {
                        isInJsonBlock = true;
                        jsonBlockDepth = 1;
                        jsonBuffer = char;
                    } else if (isInJsonBlock) {
                        jsonBuffer += char;

                        if (char === '{') {
                            jsonBlockDepth++;
                        } else if (char === '}') {
                            jsonBlockDepth--;

                            // JSON块结束
                            if (jsonBlockDepth === 0) {
                                try {
                                    const jsonData = JSON.parse(jsonBuffer);

                                    // 检查是否是工具调用
                                    if (jsonData.type === 'toolCall' || jsonData.tool) {
                                        // 添加到工具消息列表，稍后批量更新
                                        const toolKey = `tool-${Date.now()}-${Math.random().toString(36).slice(2)}`;
                                        toolMessages.push({
                                            role: 'tool',
                                            content: jsonBuffer,
                                            key: toolKey,
                                        });

                                        setNeedRefresh(true);
                                    } else {
                                        // 普通JSON，加到文本中
                                        textBuffer += jsonBuffer;
                                    }
                                } catch (e) {
                                    // 解析失败，当作普通文本
                                    textBuffer += jsonBuffer;
                                }

                                // 重置JSON状态
                                isInJsonBlock = false;
                                jsonBuffer = '';
                            }
                        }
                    } else {
                        // 普通文本字符
                        textBuffer += char;
                    }
                }

                // 批量更新消息
                if (textBuffer || toolMessages.length > 0) {
                    setMessages(prev => {
                        // 首先更新AI消息
                        const updatedMessages = prev.map(msg =>
                            msg.key === aiMessageKey
                                ? {...msg, content: textBuffer}
                                : msg
                        );

                        // 然后添加所有收集的工具消息
                        if (toolMessages.length > 0) {
                            return [...updatedMessages, ...toolMessages];
                        }
                        return updatedMessages;
                    });

                    // 清空工具消息列表
                    toolMessages.length = 0;
                }
            }
        } catch (error) {
            console.error('Error processing stream:', error);
        }
    }, []);

    // 发送消息到后端 - 使用useCallback包装
    const sendMessage = useCallback(async () => {
        if (!inputValue.trim() || isLoading) return;
        if (!currentQuizId) {
            message.error('请先创建或选择一个问卷');
            return;
        }

        // 添加用户消息
        const userMessage = {
            role: 'user',
            content: inputValue.trim(),
            key: `user-${Date.now()}`,
        };

        setMessages(prev => [...prev, userMessage as Message]);
        setInputValue('');
        setIsLoading(true);

        // 添加空AI消息占位
        const aiMessageKey = `ai-${Date.now()}`;
        setMessages(prev => [...prev, {
            role: 'ai',
            content: '',
            key: aiMessageKey,
        }]);

        try {
            // 发送请求 - 使用普通fetch处理流式响应
            const response = await fetch(`${BASE_URL}/api/question/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'satoken': useUserStore.getState().saToken || '',
                },
                body: JSON.stringify({
                    quizId: currentQuizId,
                    question: inputValue.trim(),
                    modelName,
                }),
            });

            if (!response.ok) {
                throw new Error(`网络错误: ${response.status}`);
            }

            if (!response.body) {
                throw new Error('服务器未返回响应流');
            }

            // 处理流式响应
            await handleStreamResponse(response.body, aiMessageKey);

        } catch (error) {
            console.error('Error generating response:', error);
            message.error('生成回答失败，请稍后重试');

            // 更新错误消息
            setMessages(prev => prev.map(msg =>
                msg.key === aiMessageKey
                    ? {...msg, content: '😢 抱歉，生成回答时出现错误，请稍后重试。'}
                    : msg
            ));
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, isLoading, currentQuizId, handleStreamResponse, modelName]);

    // 延迟显示加载状态，避免短时间内的闪烁
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isLoadingHistory) {
            timer = setTimeout(() => setShowLoadingSpinner(true), 200);
        } else {
            setShowLoadingSpinner(false);
        }
        return () => clearTimeout(timer);
    }, [isLoadingHistory]);

    // 加载历史记录和欢迎消息
    useEffect(() => {
        if (currentQuizId) {
            loadChatHistory();
        } else {
            setWelcomeMessage();
        }
    }, [currentQuizId, loadChatHistory, setWelcomeMessage]);

    // 监听需要刷新的标志，刷新问题列表
    useEffect(() => {
        refreshQuestions();
    }, [refreshQuestions]);

    // 模型选项
    const modelOptions = useMemo(() => [
        {value: 'gpt-4.1', label: 'gpt-4.1'},
        {value: 'DeepSeek-V3', label: 'DeepSeek-V3'},
        {value: 'gemini-2.5-pro-preview-03-25', label: 'gemini-2.5-pro'},
    ], []);

    // 定义对话角色样式 - 使用useMemo缓存并解决类型问题
    const roles = useMemo<GetProp<typeof Bubble.List, 'roles'>>(() => ({
        ai: {
            placement: 'start',
            avatar: {icon: <RobotOutlined/>, style: {background: '#1677ff', color: '#fff'}},
            messageRender: (content: string) => renderMessage(content, 'ai')
        },
        user: {
            placement: 'end',
            avatar: {icon: <UserOutlined/>, style: {background: '#87d068', color: '#fff'}},
        },
        tool: {
            placement: 'start',
            variant: 'borderless' as const,
            avatar: {
                style: {
                    // 使用display:none替代visibility:hidden，避免类型问题
                    display: 'none'
                }
            },
            messageRender: (content: string) => renderMessage(content, 'tool')
        },
    }), [renderMessage]);

    return (
        <Card
            title={
                <Flex justify="space-between" align="center">
                    <Badge dot={needRefresh} color="blue">
                        <Title level={5} style={{margin: 0}}>AI问卷助手</Title>
                    </Badge>
                    <Select
                        value={modelName}
                        onChange={setModelName}
                        options={modelOptions}
                        style={{width: 120}}
                        disabled={isLoading}
                    />
                </Flex>
            }
            extra={onClose && (
                <Button type="text" icon={<CloseOutlined/>} onClick={onClose}/>
            )}
            style={{height: '100%', display: 'flex', flexDirection: 'column'}}
            bodyStyle={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                padding: '12px'
            }}
            bordered={false}
        >
            {showLoadingSpinner ? (
                <Flex align="center" justify="center" style={{flex: 1}}>
                    <Space direction="vertical" align="center">
                        <Spin size="large"/>
                        <Text type="secondary">加载对话历史...</Text>
                    </Space>
                </Flex>
            ) : (
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '0 4px',
                    marginBottom: 16
                }}>
                    {messages.length > 0 && (
                        <Bubble.List
                            ref={bubbleListRef}
                            roles={roles}
                            items={messages}
                            autoScroll={true}
                        />
                    )}
                </div>
            )}

            <Divider style={{margin: '8px 0'}}/>

            <Sender
                value={inputValue}
                onChange={setInputValue}
                onSubmit={sendMessage}
                placeholder={isLoading ? "AI正在生成回答..." : "请描述你需要的问卷内容..."}
                loading={isLoading}
                disabled={isLoading || !currentQuizId || isLoadingHistory}
                submitType="enter"

                allowSpeech
            />
        </Card>
    );
};

export default AIAssistant;