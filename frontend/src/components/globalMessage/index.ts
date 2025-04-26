import { messageManager } from './MessageContainer';
import { MessageProps, MessageType } from './Message';

// 导出消息类型
export type { MessageProps, MessageType };

// 创建API
const message = {
    success(content: React.ReactNode, duration: number = 3000) {
        return messageManager.add({ content, type: 'success', duration });
    },

    error(content: React.ReactNode, duration: number = 3000) {
        return messageManager.add({ content, type: 'error', duration });
    },

    warning(content: React.ReactNode, duration: number = 3000) {
        return messageManager.add({ content, type: 'warning', duration });
    },

    info(content: React.ReactNode, duration: number = 3000) {
        return messageManager.add({ content, type: 'info', duration });
    },

    // 更通用的方法
    show(props: MessageProps) {
        return messageManager.add(props);
    },

    // 关闭特定消息
    close(key: string) {
        messageManager.remove(key);
    },

    // 销毁所有消息
    destroy() {
        messageManager.destroy();
    }
};

export default message;