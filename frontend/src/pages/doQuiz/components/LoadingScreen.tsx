import React from "react";
import { Spin, Flex } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingScreen: React.FC = () => {
    return (
        <Flex
            justify="center"
            align="center"
            style={{ height: '100vh', background: '#f5f5f5' }}
        >
            <Spin
                indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
                size="large"
            >
                <div style={{ padding: '50px', textAlign: 'center' }}>
                    加载中...
                </div>
            </Spin>
        </Flex>
    );
};

export default LoadingScreen;