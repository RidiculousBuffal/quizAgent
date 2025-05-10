import React from 'react';
import {Card, Typography, Tag, Space, Tooltip} from 'antd';
import {ApiOutlined, CheckCircleOutlined, CheckSquareOutlined, FormOutlined} from '@ant-design/icons';

const {Text} = Typography;

interface ToolCallMessageProps {
    tool: string;
    result?: any;
}

const ToolCallMessage: React.FC<ToolCallMessageProps> = ({tool, result}) => {
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
        }else if (tool.includes('Essay')) {
            return {
                type: '简答题',
                color: '#8912ee',
                icon: <FormOutlined/>,
                title: result?.title || '简答题'
            };
        }else if (tool.includes('File')) {
            return {
                type: '文件题',
                color: '#fa1487',
                icon: <FormOutlined/>,
                title: result?.title || '文件题'
            };
        } else {
            return {
                type: '题目',
                color: '#320e8c',
                icon: <ApiOutlined/>,
                title: '题目已创建'
            };
        }
    };

    const toolInfo = getToolInfo();

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
            <Space align="center">
                {toolInfo.icon}
                <Tooltip title="点击问题列表查看详情">
                    <Tag color={toolInfo.color}>
                        {toolInfo.type}
                    </Tag>
                </Tooltip>
                <Text strong style={{fontSize: '14px'}}>{toolInfo.title}</Text>
            </Space>
        </Card>
    );
};

export default ToolCallMessage;