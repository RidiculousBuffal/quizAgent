import React, {useEffect, useState} from "react";
import BubbleList, {messageItem} from "./BubbleList.tsx";
import {getAIAnalysisHistory} from "../../../api/quizApi.ts";
import {Alert, Space} from "antd";
import {Sender} from "@ant-design/x";
import {BASE_URL} from "../../../api/base.ts";
import {useUserStore} from "../../../store/user/UserStore.ts";
import {v4 as uuid} from 'uuid'

// 简单UUID方法


function AIModal({quizId, modelName}: { quizId?: number, modelName: string }) {
    const [messageItemList, setMessageItem] = useState<messageItem[]>([]);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (quizId) {
            getAIAnalysisHistory(quizId).then(x => setMessageItem(x!));
        } else {
            return;
        }
    }, [quizId]);

    if (!quizId) {
        return <Alert type={"warning"} message={"未能识别到问卷"}></Alert>;
    }

    async function handleSubmit() {
        setLoading(true);

        // 用户输入插入
        const question = value;
        const userMsg: messageItem = {
            key: Date.now(),
            role: 'user',
            content: question
        };
        setMessageItem(prev => [...prev, userMsg]);
        setValue('');

        const aiKey = uuid();
        const aiMsg: messageItem = {
            key: aiKey,
            role: 'ai',
            content: ''
        };
        setMessageItem(prev => [...prev, aiMsg]);

        try {
            const resp = await fetch(`${BASE_URL}/analysis/generateAnalysis`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    satoken: useUserStore.getState().saToken || "",
                },
                body: JSON.stringify({
                    model: modelName,
                    question: question,
                    quizId: quizId,
                    historyId: Date.now()
                }),
            });

            if (!resp.body) throw new Error("No stream response!");

            const reader = resp.body.getReader();
            const decoder = new TextDecoder();
            let buf = "";
            let aiContent = "";

            while (true) {
                const {value, done} = await reader.read();
                if (done) break;
                buf += decoder.decode(value, {stream: true});

                while (buf.includes("\n")) {
                    const idx = buf.indexOf("\n");
                    const line = buf.slice(0, idx); // 保留全部空白
                    buf = buf.slice(idx + 1);

                    if (line === "") continue; // SSE分隔符，可跳过

                    if (!line.startsWith("data:")) continue;

                    const data = line.slice(5); // 保留后面原始内容

                    // 空 data: 专属换行
                    if (data === "") {
                        aiContent += "\n";
                    } else {
                        aiContent += data;
                    }
                    // 实时刷新
                    setMessageItem(prev =>
                        prev.map(msg =>
                            msg.key === aiKey
                                ? {...msg, content: aiContent}
                                : msg
                        )
                    );
                }
            }
        } catch (e: any) {
            console.error(e)
        }
        setLoading(false);
    }

    return (
        <>
            <Space style={{minHeight: "800px", position: "relative"}} direction={"vertical"}>
                {messageItemList.length === 0 ?
                    <Alert
                        style={{fontSize: "20px", width: "740px", textAlign: "center"}}
                        type={"info"}
                        message={"可在下方输入框中对该问卷的回收情况进行提问"}
                    /> :
                    <div style={{height: "720px", minWidth: "770px", overflowY: "scroll"}}>
                        <BubbleList session={messageItemList}/>
                    </div>
                }
                <Sender
                    style={{width: "740px", position: "absolute", bottom: 0}}
                    loading={loading}
                    value={value}
                    onChange={v => setValue(v)}
                    onSubmit={handleSubmit}
                    onCancel={() => setLoading(false)}
                    autoSize={{minRows: 2, maxRows: 6}}
                />
            </Space>
        </>
    );
}

export default AIModal;

