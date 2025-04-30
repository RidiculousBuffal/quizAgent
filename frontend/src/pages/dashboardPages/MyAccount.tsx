import React from 'react';
import { Typography, Card, Form, Input, Button } from 'antd';
import { useUserStore } from '../../store/user/UserStore.ts';

const { Title } = Typography;

const MyAccount: React.FC = () => {
    const user = useUserStore(state => state.user)!;

    return (
        <div style={{ padding: '24px' }}>
            <Title level={4}>我的账户</Title>
            <Card>
                <Form
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    initialValues={{
                        username: user.userName,
                        email: user.userEmail
                    }}
                >
                    <Form.Item label="用户名" name="username">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="邮箱" name="email">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                        <Button type="primary">更新账户信息</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default MyAccount;