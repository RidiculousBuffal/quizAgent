import React, { useEffect, useState } from 'react';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

export interface MessageProps {
    content: React.ReactNode;
    type?: MessageType;
    duration?: number;
    onClose?: () => void;
}

const Message: React.FC<MessageProps> = ({
                                             content,
                                             type = 'info',
                                             duration = 3000,
                                             onClose,
                                         }) => {
    const [visible, setVisible] = useState(false); // 初始设为false以实现淡入效果

    // 组件挂载后立即设置为可见，实现淡入效果
    useEffect(() => {
        // 使用requestAnimationFrame确保DOM更新后再应用动画
        requestAnimationFrame(() => setVisible(true));
    }, []);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
                // 动画结束后执行关闭回调
                if (onClose) {
                    // 等待淡出动画完成
                    setTimeout(onClose, 300);
                }
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    // 根据类型获取不同样式
    const getTypeStyle = (type: MessageType): React.CSSProperties => {
        const baseStyle = {
            padding: '8px 16px',
            borderRadius: '4px',
            boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease-in-out',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(-20px)',
        };

        switch (type) {
            case 'success':
                return { ...baseStyle, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' };
            case 'error':
                return { ...baseStyle, backgroundColor: '#fff2f0', border: '1px solid #ffccc7' };
            case 'warning':
                return { ...baseStyle, backgroundColor: '#fffbe6', border: '1px solid #ffe58f' };
            case 'info':
            default:
                return { ...baseStyle, backgroundColor: '#e6f7ff', border: '1px solid #91d5ff' };
        }
    };

    const getIconByType = (type: MessageType) => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
            default:
                return 'ℹ️';
        }
    };

    return (
        <div style={getTypeStyle(type)}>
            <span style={{ marginRight: '8px' }}>{getIconByType(type)}</span>
            {content}
        </div>
    );
};

export default Message;