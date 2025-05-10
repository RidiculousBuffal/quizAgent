import React, {useState, useEffect} from 'react';
import {
    Typography,
    Card,
    Form,
    Input,
    Button,
    Upload,
    Avatar,
    message,
    Space,
    Table,
    InputNumber,
    Divider,
    Popconfirm
} from 'antd';
import {UserOutlined, UploadOutlined, LoadingOutlined, CopyOutlined, DeleteOutlined} from '@ant-design/icons';
import {useUserStore} from '../../store/user/UserStore.ts';
import {deleteApiKey, updateUserAvatar} from "../../api/userapi.ts";
import {uploadFile} from "../../api/uploadapi.ts";
import {createApiKey, getApiKeyList, ApiKeyModel, CreateApiKeyParams} from "../../api/userapi.ts";

const {Title} = Typography;

const MyAccount: React.FC = () => {
    const user = useUserStore(state => state.user);
    const setUserData = useUserStore(state => state.setUserData);
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.userAvatar);
    const [apiKeys, setApiKeys] = useState<ApiKeyModel[]>([]);
    const [loadingApiKeys, setLoadingApiKeys] = useState(false);
    const [creatingApiKey, setCreatingApiKey] = useState(false);
    const [form] = Form.useForm();
    const [deletingApiKey, setDeletingApiKey] = useState<string | null>(null);
    // 加载 API Key 列表
    useEffect(() => {
        fetchApiKeyList();
    }, []);

    const fetchApiKeyList = async () => {
        setLoadingApiKeys(true);
        try {
            const response = await getApiKeyList();
            setApiKeys(response!)
        } catch (error) {
            message.error('获取 API Key 列表失败');
            console.error('Error fetching API Keys:', error);
        } finally {
            setLoadingApiKeys(false);
        }
    };

    const handleAvatarChange = async (info: any) => {
        const file = info.file;
        try {
            setUploading(true);
            const uploadedUrl = await uploadFile({
                file,
                onProgress: (percent) => {
                    console.log(`Upload progress: ${percent}%`);
                }
            });
            await updateUserAvatar(uploadedUrl);
            setAvatarUrl(uploadedUrl);
            if (user) {
                setUserData({
                    ...user,
                    userAvatar: uploadedUrl
                });
            }
            message.success('头像更新成功！');
        } catch (error) {
            console.error('Avatar upload failed:', error);
            message.error('头像上传失败，请重试');
        } finally {
            setUploading(false);
        }
    };

    const customRequest = ({file, onSuccess}: any) => {
        handleAvatarChange({file});
        if (onSuccess) onSuccess();
    };

    const handleCreateApiKey = async (values: any) => {
        setCreatingApiKey(true);
        try {
            const params: CreateApiKeyParams = {
                title: values.title,
                intro: values.intro,
                expiresTime: values.expiresDays ? Date.now() + values.expiresDays * 24 * 60 * 60 * 1000 : -1
            };
            const response = await createApiKey(params);
            if (response) {
                message.success('API Key 创建成功');
                setApiKeys([...apiKeys, {
                    apiKey: response,
                    loginId: user?.userId || '',
                    title: params.title,
                    intro: params.intro,
                    expiresTime: params.expiresTime!,
                    isValid: true
                }]);
                form.resetFields();
            } else {
                message.error('API Key 创建失败');
            }
        } catch (error) {
            console.error('Error creating API Key:', error);
            message.error('API Key 创建失败');
        } finally {
            setCreatingApiKey(false);
        }
    };

    const handleCopyApiKey = (apiKey: string) => {
        navigator.clipboard.writeText(apiKey)
            .then(() => message.success('API Key 已复制到剪贴板'))
            .catch(() => message.error('复制失败，请手动复制'));
    };

    const handleDeleteApiKey = async (apiKey: string) => {
        setDeletingApiKey(apiKey);
        try {
            const success = await deleteApiKey(apiKey);
            if (success) {
                message.success('API Key 删除成功');
                setApiKeys(apiKeys.filter(item => item.apiKey !== apiKey));
            } else {
                message.error('API Key 删除失败');
            }
        } catch (error) {
            console.error('Error deleting API Key:', error);
            message.error('API Key 删除失败');
        } finally {
            setDeletingApiKey(null);
        }
    };

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '描述',
            dataIndex: 'intro',
            key: 'intro',
        },
        {
            title: 'API Key',
            dataIndex: 'apiKey',
            key: 'apiKey',
            render: (text: string) => (
                <Space>
                    <span style={{fontFamily: 'monospace'}}>{text.substring(0, 10)}...</span>
                    <Button
                        size="small"
                        icon={<CopyOutlined/>}
                        onClick={() => handleCopyApiKey(text)}
                    >
                        复制
                    </Button>
                </Space>
            ),
        },
        {
            title: '有效期',
            dataIndex: 'expiresTime',
            key: 'expiresTime',
            render: (time: number) => time === -1 ? '永不过期' : new Date(time).toLocaleDateString(),
        },
        {
            title: '状态',
            dataIndex: 'isValid',
            key: 'isValid',
            render: (isValid: boolean) => (isValid ? '有效' : '无效'),
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: ApiKeyModel) => (
                <Space size="middle">
                    <Popconfirm
                        title="确定要删除此 API Key 吗？"
                        onConfirm={() => handleDeleteApiKey(record.apiKey)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined/>}
                            loading={deletingApiKey === record.apiKey}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    return (
        <div style={{padding: '0'}}>
            <Title level={4}>我的账户</Title>
            <Card>
                <Form
                    labelCol={{span: 6}}
                    wrapperCol={{span: 14}}
                    initialValues={{
                        username: user?.userName,
                        email: user?.userEmail
                    }}
                >
                    <Form.Item label="头像" style={{marginBottom: '24px'}}>
                        <Space size="large" align="center">
                            <Avatar
                                size={100}
                                src={avatarUrl}
                                icon={<UserOutlined/>}
                            />
                            <Upload
                                name="avatar"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    const isImage = file.type.startsWith('image/');
                                    if (!isImage) {
                                        message.error('只能上传图片文件！');
                                    }
                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                    if (!isLt2M) {
                                        message.error('图片必须小于 2MB！');
                                    }
                                    return isImage && isLt2M;
                                }}
                                customRequest={customRequest}
                            >
                                <Button
                                    icon={uploading ? <LoadingOutlined/> : <UploadOutlined/>}
                                    loading={uploading}
                                    disabled={uploading}
                                >
                                    {uploading ? '上传中...' : '更改头像'}
                                </Button>
                            </Upload>
                        </Space>
                    </Form.Item>

                    <Form.Item label="用户名" name="username">
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item label="邮箱" name="email">
                        <Input disabled/>
                    </Form.Item>
                </Form>
            </Card>

            <Divider/>

            <Title level={4} style={{marginTop: '24px'}}>API Key 管理</Title>
            <Card style={{marginBottom: '16px'}}>
                <Title level={5}>创建新的 API Key</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateApiKey}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{required: true, message: '请输入 API Key 标题'}]}
                    >
                        <Input placeholder="请输入 API Key 标题"/>
                    </Form.Item>
                    <Form.Item
                        label="描述"
                        name="intro"
                        rules={[{required: true, message: '请输入 API Key 描述'}]}
                    >
                        <Input placeholder="请输入 API Key 描述"/>
                    </Form.Item>
                    <Form.Item
                        label="有效期（天）"
                        name="expiresDays"
                        initialValue={30}
                    >
                        <InputNumber min={1} placeholder="输入有效天数，留空为永不过期"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={creatingApiKey}>
                            创建 API Key
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card>
                <Title level={5}>我的 API Key 列表</Title>
                <Table
                    dataSource={apiKeys}
                    columns={columns}
                    rowKey="apiKey"
                    loading={loadingApiKeys}
                    locale={{emptyText: '暂无 API Key'}}
                />
            </Card>
        </div>
    );
};

export default MyAccount;