import React, {useState} from 'react';
import {Typography, Card, Form, Input, Button, Upload, Avatar, message, Space} from 'antd';
import {UserOutlined, UploadOutlined, LoadingOutlined} from '@ant-design/icons';
import {useUserStore} from '../../store/user/UserStore.ts';
import {updateUserAvatar} from "../../api/userapi.ts";
import {uploadFile} from "../../api/uploadapi.ts";


const {Title} = Typography;

const MyAccount: React.FC = () => {
    const user = useUserStore(state => state.user);
    const setUserData = useUserStore(state => state.setUserData);
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.userAvatar);

    const handleAvatarChange = async (info: any) => {
        const file = info.file;

        try {
            setUploading(true);
            // Upload file and get the URL
            const uploadedUrl = await uploadFile({
                file,
                onProgress: (percent) => {
                    console.log(`Upload progress: ${percent}%`);
                }
            });

            // Update user avatar in backend
            await updateUserAvatar(uploadedUrl);

            // Update local state
            setAvatarUrl(uploadedUrl);

            // Update user state in store
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

    // Custom request function to prevent default upload behavior
    const customRequest = ({file, onSuccess}: any) => {
        handleAvatarChange({file});
        if (onSuccess) onSuccess();
    };

    return (
        <div style={{padding: '24px'}}>
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
        </div>
    );
};

export default MyAccount;