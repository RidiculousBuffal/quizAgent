// AIAssistant.tsx
import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import MarkdownIt from "markdown-it";
import {Bubble, Sender} from "@ant-design/x";
import {
    Card,
    Typography,
    Select,
    Space,
    Flex,
    Badge,
    Button,
    Divider,
    Spin,
} from "antd";
import {
    RobotOutlined,
    UserOutlined,
    CloseOutlined,
} from "@ant-design/icons";

import {useQuizStore} from "../../store/quiz/QuizStore";
import {useQuestionStore} from "../../store/question/QuestionStore";
import {getAllQuestionsInQuiz} from "../../api/questionapi";
import {getAIGenerationHistory} from "../../api/aigenerationapi";
import {BASE_URL} from "../../api/base";
import {useUserStore} from "../../store/user/UserStore";
import message from "../../components/globalMessage";
import ToolCallMessage from "./ToolCallMessage";
import {ChatMessage} from "../../store/ai/ChatSlice.ts";
import {
    useChatStore,
} from '../../store/ai/ChatStore.ts'          // ★ 新增

const {Text, Title} = Typography;
const md = new MarkdownIt();

/* -------------------------------------------------- */
/*            工具：安全解析 JSON / Markdown           */

/* -------------------------------------------------- */
function safeParseToolCall(raw: string) {
    try {
        return JSON.parse(raw);
    } catch {
        const repaired = raw.replace(
            /"result":"({[\s\S]*})"/,
            (_, inner) => `"result":${inner.replace(/\\"/g, '"')}`,
        );
        return JSON.parse(repaired);
    }
}

/* ================================================== */
/*                 组件主体  AIAssistant               */
/* ================================================== */
const AIAssistant: React.FC<{ onClose?: () => void }> = ({onClose}) => {
    /* ------------- local state (非消息) ------------- */
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [modelName, setModelName] = useState("gpt-4.1");
    const [needRefresh, setNeedRefresh] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

    /* ------------- refs ------------- */
    const bubbleListRef = useRef<any>(null);
    const historyLoadedRef = useRef(false);

    /* ------------- Zustand 外部 store ------------- */
    const messages = useChatStore((s) => s.messages);        // ⚡ 全局消息
    const appendMessages = useCallback(
        (msg: ChatMessage | ChatMessage[]) =>
            useChatStore.getState().appendMessages(msg),
        [],
    );
    const patchMessage = useCallback(
        (key: string | number, partial: Partial<ChatMessage>) =>
            useChatStore.getState().patchMessage(key, partial),
        [],
    );
    const resetMessages = useCallback(
        (msgs?: ChatMessage[]) => useChatStore.getState().resetMessages(msgs),
        [],
    );

    /* ------------- 其它外部 stores ------------- */
    const currentQuizId = useQuizStore((q) => q.curEditQuizId);
    const setRawQuestions = useQuestionStore((s) => s.setRawQuestions);

    /* ------------- helper：渲染 Markdown / ToolCall ------------- */
    const renderMarkdown = useCallback(
        (txt: string) =>
            txt ? (
                <div
                    dangerouslySetInnerHTML={{
                        __html: md.render(txt),
                    }}
                />
            ) : null,
        [],
    );

    const renderMessage = useCallback(
        (content: any, role: string) => {
            if (role === "tool") {
                const obj =
                    typeof content === "string" ? safeParseToolCall(content) : content;
                if (obj?.type === "toolCall") {
                    let resultData = obj.result;
                    if (typeof resultData === "string") {
                        try {
                            resultData = JSON.parse(resultData);
                        } catch {
                            /* ignore */
                        }
                    }
                    return <ToolCallMessage tool={obj.tool} result={resultData}/>;
                }
                return <ToolCallMessage tool="unknown"/>;
            }
            return renderMarkdown(String(content));
        },
        [renderMarkdown],
    );

    /* ---------------- 欢迎词 ---------------- */
    const setWelcomeMessage = useCallback(() => {
        resetMessages([
            {
                role: "ai",
                content:
                    "👋 我是你的问卷设计助手，可以帮你生成各种类型的问卷题目。请告诉我你想创建什么主题的问卷，需要包含哪些类型的问题，我将为你自动生成相关题目。",
                key: "welcome",
            },
        ]);
    }, [resetMessages]);

    /* ================================================= */
    /*               历史记录加载 &rarr; 写入 store            */
    /* ================================================= */
    const loadChatHistory = useCallback(async () => {
        if (historyLoadedRef.current || !currentQuizId) return;
        setIsLoadingHistory(true);

        try {
            const history = await getAIGenerationHistory(currentQuizId);
            if (history?.length) {
                const list: ChatMessage[] = [];

                history.forEach((h, idx) => {
                    if (h.inputPrompt)
                        list.push({
                            role: "user",
                            content: h.inputPrompt.replace(/^User:\s*/i, ""),
                            key: `h-user-${idx}`,
                        });

                    if (h.generatedResult) {
                        try {
                            const obj: {
                                text: string,
                                toolCalls: [],
                                aiResponse: string
                            } = JSON.parse(h.generatedResult);

                            if (obj.text || obj.toolCalls) {
                                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                obj.text?.trim() &&
                                list.push({
                                    role: "ai",
                                    content: obj.text,
                                    key: `h-ai-${idx}`,
                                });
                                obj.toolCalls?.forEach((t: any, i: number) =>
                                    list.push({
                                        role: "tool",
                                        content: JSON.stringify(t),
                                        key: `h-tool-${idx}-${i}`,
                                    }),
                                );
                            } else if (obj.aiResponse) {
                                const segs = obj.aiResponse.split("[ToolCall]");
                                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                segs[0].trim() &&
                                list.push({
                                    role: "ai",
                                    content: segs[0].trim(),
                                    key: `h-ai-${idx}`,
                                });
                                segs.slice(1).forEach((s: string, i: number) =>
                                    list.push({
                                        role: "tool",
                                        content: `[ToolCall] ${s}`,
                                        key: `h-tool-${idx}-${i}`,
                                    }),
                                );
                            } else {
                                list.push({
                                    role: "ai",
                                    content: h.generatedResult,
                                    key: `h-ai-${idx}`,
                                });
                            }
                        } catch {
                            list.push({
                                role: "ai",
                                content: h.generatedResult,
                                key: `h-ai-${idx}`,
                            });
                        }
                    }
                });

                resetMessages(list.length ? list : [{role: "ai", content: "", key: "empty"}]);
            } else {
                setWelcomeMessage();
            }
            historyLoadedRef.current = true;
        } catch (err) {
            console.error(err);
            setWelcomeMessage();
        } finally {
            setIsLoadingHistory(false);
        }
    }, [currentQuizId, resetMessages, setWelcomeMessage]);

    /* ================================================= */
    /*                拉取新题写入 QuestionStore          */
    /* ================================================= */
    const refreshQuestions = useCallback(async () => {
        if (!needRefresh || !currentQuizId) return;

        try {
            const list = await getAllQuestionsInQuiz(currentQuizId);
            if (list) {
                setRawQuestions(list);
                message.success("新的题目已添加到列表");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setNeedRefresh(false);
        }
    }, [needRefresh, currentQuizId, setRawQuestions]);

    /* ================================================= */
    /*               处理流式响应 &rarr; store                */
    /* ================================================= */
    const handleStreamResponse = useCallback(
        async (stream: ReadableStream<Uint8Array>, aiKey: string) => {
            if (!stream) return;

            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let buf = "";
            let plain = "";
            let pendingToolMsgs: ChatMessage[] = [];

            try {
                while (true) {
                    const {done, value} = await reader.read();
                    if (done) break;

                    buf += decoder.decode(value, {stream: true});

                    /* 按行拆，SSE 每行一条指令 */
                    while (buf.includes("\n")) {
                        const idx = buf.indexOf("\n");
                        const line = buf.slice(0, idx);       // ★ 不再 trim()，保持前后空格
                        buf = buf.slice(idx + 1);

                        if (line === "") continue;            // SSE 事件分隔行，忽略

                        if (!line.startsWith("data:")) continue;

                        /* 去掉前缀，但完全保留原始内容 */
                        const data = line.slice(5);           // 可能是 "" / JSON / 普通文本

                        /* ---------- ① 空 data: ==> 换行 ---------- */
                        if (data === "") {
                            plain += "\n";
                            continue;
                        }

                        /* ---------- ② 尝试解析 ToolCall ---------- */
                        if (data[0] === "{") {
                            try {
                                const obj = safeParseToolCall(data);
                                if (obj?.type === "toolCall") {
                                    pendingToolMsgs.push({
                                        role: "tool",
                                        content: JSON.stringify(obj),
                                        key: `tool-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                    });
                                    setNeedRefresh(true);
                                    continue;                       // ToolCall 不进入正文
                                }
                            } catch {
                                /* fall through 当成普通文本处理 */
                            }
                        }

                        /* ---------- ③ 普通文本片段 ---------- */
                        plain += data;                        // ★ 不再附加额外换行
                    }

                    /* 流式刷新 UI */
                    patchMessage(aiKey, {
                        content: plain.replace(/\n{3,}/g, "\n\n"), // 折叠 3 连空行
                    });
                    if (pendingToolMsgs.length) {
                        appendMessages(pendingToolMsgs);
                        pendingToolMsgs = [];
                    }
                }
            } finally {
                patchMessage(aiKey, {
                    content: plain.replace(/\n{3,}/g, "\n\n"),
                });
                if (pendingToolMsgs.length) appendMessages(pendingToolMsgs);
            }
        },
        [appendMessages, patchMessage],
    );

    /* ================================================= */
    /*                   发送消息                        */
    /* ================================================= */
    const sendMessage = useCallback(async () => {
        if (!inputValue.trim() || isLoading) return;
        if (!currentQuizId) {
            message.error("请先创建或选择一个问卷");
            return;
        }

        const userKey = `user-${Date.now()}`;
        const aiKey = `ai-${Date.now()}`;

        appendMessages([
            {role: "user", content: inputValue.trim(), key: userKey},
            {role: "ai", content: "", key: aiKey},
        ]);
        setInputValue("");
        setIsLoading(true);

        try {
            const resp = await fetch(`${BASE_URL}/api/question/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    satoken: useUserStore.getState().saToken || "",
                },
                body: JSON.stringify({
                    quizId: currentQuizId,
                    question: inputValue.trim(),
                    modelName,
                }),
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            if (!resp.body) throw new Error("empty body");
            await handleStreamResponse(resp.body, aiKey);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [
        inputValue,
        isLoading,
        currentQuizId,
        modelName,
        appendMessages,
        handleStreamResponse,
    ]);

    /* ================================================= */
    /*                       effects                     */
    /* ================================================= */
    useEffect(() => {
        if (currentQuizId) {
            loadChatHistory();
        } else {
            setWelcomeMessage();
            historyLoadedRef.current = false;
        }
    }, [currentQuizId, loadChatHistory, setWelcomeMessage]);

    useEffect(() => {
        refreshQuestions();
    }, [refreshQuestions]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        if (isLoadingHistory) {
            timer = setTimeout(() => setShowLoadingSpinner(true), 200);
        } else {
            setShowLoadingSpinner(false);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isLoadingHistory]);

    /* ================================================= */
    /*                  气泡角色 / 选项                  */
    /* ================================================= */
    const roles = useMemo(
        () => ({
            ai: {
                placement: "start",
                avatar: {
                    icon: <RobotOutlined/>,
                    style: {background: "#1677ff", color: "#fff"},
                },
                messageRender: (c: any) => renderMessage(c, "ai"),
            },
            user: {
                placement: "end",
                avatar: {
                    icon: <UserOutlined/>,
                    style: {background: "#87d068", color: "#fff"},
                },
            },
            tool: {
                placement: "start",
                variant: "borderless" as const,
                avatar: {style: {display: "none"}},
                messageRender: (c: any) => renderMessage(c, "tool"),
            },
        }),
        [renderMessage],
    );

    const modelOptions = [
        {value: "gpt-4.1", label: "gpt-4.1"},
        {value: "DeepSeek-V3", label: "DeepSeek-V3"},
        {value: "gemini-2.5-pro-preview-03-25", label: "gemini-2.5-pro"},
    ];

    /* ================================================= */
    /*                       JSX                         */
    /* ================================================= */
    return (
        <Card
            variant={"borderless"}
            style={{height: "100%", display: "flex", flexDirection: "column"}}
            styles={{
                body: {
                    flex: 1,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    padding: 12,
                }
            }}
            title={
                <Flex justify="space-between" align="center">
                    <Badge dot={needRefresh} color="blue">
                        <Title level={5} style={{margin: 0}}>
                            AI问卷助手
                        </Title>
                    </Badge>
                    <Select
                        value={modelName}
                        onChange={setModelName}
                        options={modelOptions}
                        style={{width: 140}}
                        disabled={isLoading}
                    />
                </Flex>
            }
            extra={
                onClose && (
                    <Button type="text" icon={<CloseOutlined/>} onClick={onClose}/>
                )
            }
        >
            {showLoadingSpinner ? (
                <Flex flex={1} align="center" justify="center">
                    <Space direction="vertical" align="center">
                        <Spin size="large"/>
                        <Text type="secondary">加载中...</Text>
                    </Space>
                </Flex>
            ) : (
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "0 4px",
                        marginBottom: 16,
                    }}
                >
                    {messages.length > 0 && (
                        <Bubble.List
                            ref={bubbleListRef}
                            roles={roles as any}
                            items={messages.map((x) => ({
                                key: x.key,
                                role: x.role,
                                content: x.content,
                                loading: !x.content
                            }))}
                            autoScroll
                        />
                    )}
                </div>
            )}

            <Divider style={{margin: "8px 0"}}/>

            <Sender
                value={inputValue}
                onChange={setInputValue}
                onSubmit={sendMessage}
                submitType="enter"
                placeholder={isLoading ? "AI 正在生成..." : "请描述你需要的问卷内容..."}
                loading={isLoading}
                disabled={isLoading || !currentQuizId || isLoadingHistory}
                allowSpeech
            />
        </Card>
    );
};

export default AIAssistant;