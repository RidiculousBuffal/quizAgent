export const gradientColors = [
    {from: '#FF416C', to: '#FF4B2B'},  // 红色系
    {from: '#4776E6', to: '#8E54E9'},  // 紫蓝系
    {from: '#00B4DB', to: '#0083B0'},  // 蓝色系
    {from: '#FF8008', to: '#FFC837'},  // 橙黄系
    {from: '#16A085', to: '#F4D03F'},  // 绿黄系
    {from: '#667eea', to: '#764ba2'},  // 蓝紫系
    {from: '#11998e', to: '#38ef7d'},  // 绿色系
    {from: '#fc5c7d', to: '#6a82fb'},  // 粉蓝系
    {from: '#22c1c3', to: '#fdbb2d'},  // 青橙系
    {from: '#ff9966', to: '#ff5e62'},  // 橙红系
];

// 获取随机渐变颜色对
export const getRandomGradient = () => {
    const index = Math.floor(Math.random() * gradientColors.length);
    return gradientColors[index];
};

// 获取真正的随机渐变颜色组合
export const getTrulyRandomGradient = () => {
    // 随机获取两个不同的颜色组合
    const firstIndex = Math.floor(Math.random() * gradientColors.length);
    const secondIndex = Math.floor(Math.random() * gradientColors.length);

    return {
        from: gradientColors[firstIndex].from,
        to: gradientColors[secondIndex].to
    };
};