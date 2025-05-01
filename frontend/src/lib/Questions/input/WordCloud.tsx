// src/components/statistics/WordCloud.tsx
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import cloud from 'd3-cloud';

interface WordCloudProps {
    data: Array<{
        text: string;
        value: number;
    }>;
    width?: number;
    height?: number;
}

const WordCloud: React.FC<WordCloudProps> = ({
                                                 data,
                                                 width = 400,
                                                 height = 300
                                             }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || data.length === 0) return;

        // 清除现有内容
        const container = containerRef.current;
        d3.select(container).selectAll("*").remove();

        // 设置词云布局
        const layout = cloud()
            .size([width, height])
            .words(data.map(d => ({
                text: d.text,
                size: 10 + d.value * 3.5, // 根据词频调整字体大小
                value: d.value
            })))
            .padding(5)
            .rotate(() => (~~(Math.random() * 6) - 3) * 15) // 随机旋转角度
            .font("Arial")
            .fontSize(d => d.size as number)
            .on("end", draw);

        layout.start();

        // 渲染词云
        function draw(words: any[]) {
            // 颜色比例尺
            const colorScale = scaleOrdinal(schemeCategory10);

            const svg = d3.select(container)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2},${height / 2})`);

            // 添加文字元素
            svg.selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", d => `${d.size}px`)
                .style("font-family", "Arial")
                .style("fill", (_, i) => colorScale(i.toString()))
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
                .text(d => d.text)
                .append("title") // 添加悬停提示
                .text(d => `${d.text}: ${d.value} 次出现`);
        }

        return () => {
            // 清理
            if (container) {
                d3.select(container).selectAll("*").remove();
            }
        };
    }, [data, width, height]);

    return <div ref={containerRef} style={{ width, height, margin: '0 auto' }} />;
};

export default WordCloud;