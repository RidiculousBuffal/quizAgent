import React, { useEffect, useState } from "react";
import {
    Modal,
    Button,
    Select,
    Radio,
    Tag,
    Input,
    Tooltip,
    message,
    Space,
    Divider,
    Typography,
    App,
    Flex
} from "antd";
import { updateQuizStatus } from "../../api/quizApi";
import { getQuizPermissionDetails, saveQuizPermission } from "../../api/quizpermissionapi.ts";
import { autocompleteUsers, getUserInfo, UserType } from "../../api/userapi.ts";
import {
    CopyOutlined,
    SettingOutlined,
    LockOutlined,
    GlobalOutlined,
    UserOutlined,
    StopOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { Text, Title } = Typography;

export type PublishPermissionModalProps = {
    open: boolean;
    onCancel: () => void;
    quizId: number;
    status: number; // 0未发布，1已发布
    onStatusChange: (newStatus: number) => void;
};

const PERMISSION_PUBLIC = 'public';
const PERMISSION_PRIVATE = 'private';

const QuizPublishPermissionModal: React.FC<PublishPermissionModalProps> = ({
    open,
    onCancel,
    quizId,
    status,
    onStatusChange
}) => {
    const { message: contextMessage, modal } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [permissionType, setPermissionType] = useState(PERMISSION_PUBLIC);
    const [autoUsers, setAutoUsers] = useState<UserType[]>([]);
    const [detailsId, setDetailsId] = useState<number>();
    const [selectedAllow, setSelectedAllow] = useState<string[]>([]);
    const [selectedDeny, setSelectedDeny] = useState<string[]>([]);

    // 答题链接
    const answerUrl = `${import.meta.env.VITE_APP_URL}/doQuiz/${quizId}`;

    // 初始化时拉取权限详情
    useEffect(() => {
        if (!quizId || !open) return;

        const fetchPermissionDetails = async () => {
            setLoading(true);
            try {
                const res = await getQuizPermissionDetails(quizId);
                if (!res) return;

                setDetailsId(res.id);
                const details = res.details!;

                if (details.needLogin) {
                    setPermissionType(PERMISSION_PRIVATE);
                    details.allowUsers?.forEach(async userId => {
                        const user = await getUserInfo(userId);
                        if (user) setAutoUsers(prev => [...prev, user]);
                    });
                    details.denyUsers?.forEach(async userId => {
                        const user = await getUserInfo(userId);
                        if (user) setAutoUsers(prev => [...prev, user]);
                    });
                    setSelectedAllow(details.allowUsers ?? []);
                    setSelectedDeny(details.denyUsers ?? []);
                } else {
                    setPermissionType(PERMISSION_PUBLIC);
                    setSelectedAllow([]);
                    setSelectedDeny([]);
                }
            } catch (error) {
                // 默认设置
                setPermissionType(PERMISSION_PUBLIC);
                setSelectedAllow([]);
                setSelectedDeny([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPermissionDetails();
    }, [quizId, open]);

    // 自动补全handler
    const handleUserSearch = async (value: string) => {
        if (!value || value.length < 2) return;

        setLoading(true);
        try {
            const users = await autocompleteUsers(value);
            setAutoUsers(users || []);
        } catch (error) {
            contextMessage.error('获取用户列表失败');
        } finally {
            setLoading(false);
        }
    };

    // 状态切换
    const handleStatusChange = async () => {
        const targetStatus = status === 1 ? 0 : 1;

        setLoading(true);
        try {
            await updateQuizStatus(quizId, targetStatus);
            onStatusChange(targetStatus);
            contextMessage.success(targetStatus === 1 ? "发布成功" : "已设为未发布");
        } catch (error) {
            contextMessage.error('状态更新失败');
        } finally {
            setLoading(false);
        }
    };

    // 复制链接
    const copyLink = () => {
        navigator.clipboard.writeText(answerUrl);
        contextMessage.success("链接已复制");
    };

    // 权限同步保存
    const savePermission = async () => {
        setLoading(true);

        try {
            // private模式下,黑白名单互斥
            if (permissionType === PERMISSION_PRIVATE &&
                selectedAllow.length > 0 && selectedDeny.length > 0) {
                contextMessage.warning('仅能设置允许名单或拒绝名单其一');
                return;
            }

            await saveQuizPermission({
                id: detailsId,
                quizId,
                quizPermissionTypeId: permissionType === PERMISSION_PUBLIC ? 1 : 2,
                details: {
                    needLogin: permissionType === PERMISSION_PRIVATE,
                    allowUsers: selectedAllow,
                    denyUsers: selectedDeny,
                },
            });

            contextMessage.success('权限设置已保存');
        } catch (error) {
            contextMessage.error('保存权限设置失败');
        } finally {
            setLoading(false);
        }
    };

    // 确认取消发布
    const confirmCancelPublish = () => {
        modal.confirm({
            title: '确认取消发布',
            content: '取消发布后，问卷链接将无法访问。确定要取消发布吗？',
            onOk: handleStatusChange,
            okText: '确认',
            cancelText: '取消',
        });
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            maskClosable={false}
            width={650}
            title={(
                <Flex align="center">
                    <SettingOutlined style={{ marginRight: 8, fontSize: 18 }} />
                    <span>问卷发布与权限设置</span>
                </Flex>
            )}
            footer={[
                <Button key="cancel" onClick={onCancel}>关闭</Button>,
                <Button
                    key="save"
                    type="primary"
                    loading={loading}
                    onClick={savePermission}
                    icon={<LockOutlined />}
                >
                    保存权限设置
                </Button>,
            ]}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 发布状态区域 */}
                <div>
                    <Title level={5}>发布状态</Title>
                    <Flex align="center" gap={8}>
                        <Text>当前状态：</Text>
                        <Tag color={status === 1 ? 'success' : 'default'} style={{ fontSize: '14px', padding: '2px 10px' }}>
                            {status === 1 ? "已发布" : "未发布"}
                        </Tag>
                    </Flex>

                    {status === 1 ? (
                        <Flex vertical gap={12} style={{ marginTop: 12 }}>
                            <Flex align="center" gap={8}>
                                <Text>答题链接：</Text>
                                <Input.Group compact style={{ width: 'auto', flex: 1 }}>
                                    <Input
                                        value={answerUrl}
                                        readOnly
                                        style={{ width: 'calc(100% - 40px)' }}
                                    />
                                    <Tooltip title="复制链接">
                                        <Button
                                            icon={<CopyOutlined />}
                                            onClick={copyLink}
                                        />
                                    </Tooltip>
                                </Input.Group>
                            </Flex>
                            <Button
                                danger
                                icon={<StopOutlined />}
                                loading={loading}
                                onClick={confirmCancelPublish}
                            >
                                取消发布
                            </Button>
                        </Flex>
                    ) : (
                        <Button
                            type="primary"
                            style={{ marginTop: 12 }}
                            loading={loading}
                            onClick={handleStatusChange}
                        >
                            立即发布
                        </Button>
                    )}
                </div>

                <Divider style={{ margin: '12px 0' }} />

                {/* 权限设置区域 */}
                <div>
                    <Title level={5}>权限设置</Title>
                    <Radio.Group
                        value={permissionType}
                        onChange={e => setPermissionType(e.target.value)}
                        optionType="button"
                        buttonStyle="solid"
                        style={{ marginBottom: 16 }}
                    >
                        <Radio.Button value={PERMISSION_PUBLIC}>
                            <Flex align="center" gap={4}>
                                <GlobalOutlined />
                                <span>公开访问</span>
                            </Flex>
                        </Radio.Button>
                        <Radio.Button value={PERMISSION_PRIVATE}>
                            <Flex align="center" gap={4}>
                                <LockOutlined />
                                <span>指定用户访问</span>
                            </Flex>
                        </Radio.Button>
                    </Radio.Group>

                    {permissionType === PERMISSION_PUBLIC && (
                        <div className="permission-info">
                            <Text type="secondary">
                                任何用户均可访问此问卷，无需登录验证。
                            </Text>
                        </div>
                    )}

                    {permissionType === PERMISSION_PRIVATE && (
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Text type="secondary">
                                仅允许指定已登录用户访问。请选择允许名单或拒绝名单（二选一）：
                            </Text>

                            <div className="allow-list">
                                <Flex vertical gap={8}>
                                    <Flex align="center" gap={4}>
                                        <UserOutlined style={{ color: '#52c41a' }} />
                                        <Text strong>允许名单（白名单）</Text>
                                    </Flex>
                                    <Text type="secondary" style={{ marginBottom: 4 }}>
                                        仅列表中的用户可访问此问卷
                                    </Text>
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="搜索并添加允许访问的用户"
                                        value={selectedAllow}
                                        onChange={list => { setSelectedAllow(list); console.log(selectedAllow) }}
                                        onSearch={handleUserSearch}
                                        disabled={selectedDeny.length > 0}
                                        filterOption={false}
                                        maxTagCount="responsive"
                                        loading={loading}
                                        showSearch
                                        optionFilterProp="children"
                                        notFoundContent={loading ? "搜索中..." : "未找到匹配用户"}
                                    >
                                        {autoUsers.map(user => (
                                            <Option key={user.userId} value={user.userId}>
                                                <Flex align="center" justify="space-between">
                                                    <Text>{user.userName || user.userId}</Text>
                                                    <Text type="secondary">{user.userEmail || user.userId}</Text>
                                                </Flex>
                                            </Option>
                                        ))}
                                    </Select>
                                </Flex>
                            </div>

                            <Divider style={{ margin: '12px 0' }}>或</Divider>

                            <div className="deny-list">
                                <Flex vertical gap={8}>
                                    <Flex align="center" gap={4}>
                                        <StopOutlined style={{ color: '#ff4d4f' }} />
                                        <Text strong>拒绝名单（黑名单）</Text>
                                    </Flex>
                                    <Text type="secondary" style={{ marginBottom: 4 }}>
                                        列表中的用户将无法访问此问卷，其余登录用户可访问
                                    </Text>
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="搜索并添加拒绝访问的用户"
                                        value={selectedDeny}
                                        onChange={list => setSelectedDeny(list)}
                                        onSearch={handleUserSearch}
                                        disabled={selectedAllow.length > 0}
                                        filterOption={false}
                                        maxTagCount="responsive"
                                        loading={loading}
                                        showSearch
                                        optionFilterProp="children"
                                        notFoundContent={loading ? "搜索中..." : "未找到匹配用户"}
                                    >
                                        {autoUsers.map(user => (
                                            <Option key={user.userId} value={user.userId}>
                                                <Flex align="center" justify="space-between">
                                                    <Text>{user.userName || user.userId}</Text>
                                                    <Text type="secondary">{user.userEmail || user.userId}</Text>
                                                </Flex>
                                            </Option>
                                        ))}
                                    </Select>
                                </Flex>
                            </div>
                        </Space>
                    )}
                </div>
            </Space>
        </Modal>
    );
};

export default QuizPublishPermissionModal;