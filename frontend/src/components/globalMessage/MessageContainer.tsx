import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Message, { MessageProps } from './Message';

interface MessageInstance extends MessageProps {
    key: string;
}

interface MessageContainerProps {
    messages: MessageInstance[];
    removeMessage: (key: string) => void;
}

// 最大可显示的消息数量
const MAX_VISIBLE_MESSAGES = 3;

// 消息容器组件
const MessageContainer: React.FC<MessageContainerProps> = ({
                                                               messages,
                                                               removeMessage,
                                                           }) => {
    const [expanded, setExpanded] = useState(false);

    const containerStyle: React.CSSProperties = {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const visibleMessages = expanded
        ? messages
        : messages.slice(0, MAX_VISIBLE_MESSAGES);

    const hiddenCount = messages.length - visibleMessages.length;

    // 折叠提示样式
    const collapsedNoticeStyle: React.CSSProperties = {
        padding: '8px 16px',
        borderRadius: '4px',
        backgroundColor: '#f2f2f2',
        border: '1px solid #d9d9d9',
        marginBottom: '16px',
        cursor: 'pointer',
        textAlign: 'center',
        width: '100%',
        maxWidth: '300px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s',
    };

    return (
        <div style={containerStyle}>
            {visibleMessages.map(({ key, ...props }) => (
                <Message
                    key={key}
                    {...props}
                    onClose={() => removeMessage(key)}
                />
            ))}

            {/* 显示折叠提示 */}
            {hiddenCount > 0 && (
                <div
                    style={collapsedNoticeStyle}
                    onClick={() => setExpanded(true)}
                >
                    点击查看全部 {hiddenCount} 条消息
                </div>
            )}

            {/* 显示收起按钮 */}
            {expanded && messages.length > MAX_VISIBLE_MESSAGES && (
                <div
                    style={collapsedNoticeStyle}
                    onClick={() => setExpanded(false)}
                >
                    收起
                </div>
            )}
        </div>
    );
};

// 消息管理器
class MessageManager {
    private container: HTMLDivElement | null = null;
    private messages: MessageInstance[] = [];
    private seed = 0;
    private maxMessages = 10; // 最大保留的消息数量

    constructor() {
        if (typeof document !== 'undefined') {
            this.container = document.createElement('div');
            this.container.id = 'global-message-container';
            document.body.appendChild(this.container);
            this.render();
        }
    }

    add = (props: MessageProps): string => {
        const key = `message-${this.seed++}`;

        // 限制消息数量，防止内存泄漏
        if (this.messages.length >= this.maxMessages) {
            this.messages = this.messages.slice(-this.maxMessages + 1);
        }

        this.messages = [...this.messages, { ...props, key }];
        this.render();
        return key;
    };

    remove = (key: string) => {
        this.messages = this.messages.filter(message => message.key !== key);
        this.render();
    };

    destroy = () => {
        if (this.container && this.container.parentNode) {
            ReactDOM.unmountComponentAtNode(this.container);
            this.container.parentNode.removeChild(this.container);
            this.container = null;
            this.messages = [];
        }
    };

    private render() {
        if (this.container) {
            ReactDOM.render(
                <MessageContainer
                    messages={this.messages}
                    removeMessage={this.remove}
                />,
                this.container
            );
        }
    }
}

// 创建单例
export const messageManager = new MessageManager();