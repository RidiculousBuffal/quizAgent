import React from 'react';
import './FullScreenLoading.css';

interface FullScreenLoadingProps {
    type?: 'spinner' | 'dots' | 'pulse';
    size?: 'small' | 'medium' | 'large';
    color?: string;
    text?: string;
    backgroundColor?: string;
}

const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
    type = 'spinner',
    size = 'large',
    color = '#3498db',
    text = 'Loading...',
    backgroundColor = 'rgba(255, 255, 255, 0.9)'
}) => {
    // 根据类型选择不同的加载指示器
    const renderLoader = () => {
        switch (type) {
            case 'dots':
                return (
                    <div className={`loading-dots ${size}`} style={{ color }}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                );
            case 'pulse':
                return (
                    <div className={`loading-pulse ${size}`} style={{ backgroundColor: color }}></div>
                );
            case 'spinner':
            default:
                return (
                    <div className={`loading-spinner ${size}`} style={{ borderTopColor: color }}></div>
                );
        }
    };

    return (
        <div className="fullscreen-loading" style={{ backgroundColor }}>
            <div className="loading-wrapper">
                {renderLoader()}
                {text && <div className="loading-text" style={{ color }}>{text}</div>}
            </div>
        </div>
    );
};

export default FullScreenLoading;