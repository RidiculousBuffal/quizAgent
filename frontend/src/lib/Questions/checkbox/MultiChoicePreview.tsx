import React, {useState, useEffect, useMemo, useRef} from 'react';
import {Checkbox, Space, Input, Typography, Row, Col, Tag, GetRef} from 'antd';
import {MultipleChoiceQuestion} from './checkbox.ts';
import {BaseQuestionPreviewParams} from '../BaseQuestion.ts';

const {Text} = Typography;

/* ---------- 工具：可重复的 Fisher-Yates 洗牌 ---------- */
function shuffle<T>(arr: T[], seed = Date.now()): T[] {
    const res = [...arr];
    let m = res.length;
    let random = seed % 2147483647;
    const next = () => (random = (random * 16807) % 2147483647) / 2147483647;

    while (m) {
        const i = Math.floor(next() * m--);
        [res[m], res[i]] = [res[i], res[m]];
    }
    return res;
}

/* ------------------------------------------------------- */

interface MultipleChoicePreviewProps extends BaseQuestionPreviewParams {
    question: MultipleChoiceQuestion;
    value: string[];
    onChange: (value: string[]) => void;
    showValidation?: boolean;
}

const MultipleChoicePreviewComponent: React.FC<MultipleChoicePreviewProps> = ({
                                                                                  question,
                                                                                  value,
                                                                                  onChange,
                                                                                  showValidation = false,
                                                                              }) => {
    // Ensure value is always an array
    const safeValue = useMemo(() => {
        return Array.isArray(value) ? value : [];
    }, [value])
    const [otherValue, setOtherValue] = useState('');
    const otherInputRef = useRef<GetRef<typeof Input>>(null);

    // Ensure options have id property by using key if id is missing
    const normalizedOptions = useMemo(() => {
        return (question.options || []).map(opt => ({
            ...opt,
            id: opt.id || opt.key // Use key as fallback for id
        }));
    }, [question.options]);

    // Ensure exclusiveOptions exists and is an array
    const exclusiveOptions = Array.isArray(question.exclusiveOptions)
        ? question.exclusiveOptions
        : [];

    /* ---------- "其他"是否被选中 ---------- */
    const isOtherSelected =
        safeValue.includes('other') || safeValue.some((v) => v.startsWith('other:'));

    /* ---------- Checkbox.Group 的受控 value ---------- */
    const checkboxValues = useMemo(
        () => safeValue.map((v) => (v.startsWith('other:') ? 'other' : v)),
        [safeValue],
    );

    /* ---------- 稳定随机排序 ---------- */
    const randomOrderRef = useRef<string[] | null>(null);

    useEffect(() => {
        if (question.randomizeOptions) {
            randomOrderRef.current = shuffle(
                normalizedOptions.map((o) => o.id),
            );
        } else {
            randomOrderRef.current = null;
        }
    }, [question.randomizeOptions, normalizedOptions]);

    const displayOptions = useMemo(() => {
        if (!question.randomizeOptions || !randomOrderRef.current) {
            return normalizedOptions;
        }

        const map = Object.fromEntries(
            normalizedOptions.map((o) => [o.id, o]),
        );

        return randomOrderRef.current
            .map((id) => map[id])
            .filter(Boolean);
    }, [normalizedOptions, question.randomizeOptions]);

    /* ---------- 处理勾选变化 ---------- */
    const handleCheckboxChange = (checked: string[]) => {
        // Handle null/undefined checked value
        console.log("changed")
        if (!checked) {
            onChange([]);
            return;
        }

        // 选中的互斥 id（uuid string）
        const exclusiveId = exclusiveOptions.find((id) =>
            checked.includes(id),
        );

        // 1. 如果新勾选了互斥选项 &rarr; 只保留它
        if (
            exclusiveId &&
            !checkboxValues.includes(exclusiveId) &&
            checked.includes(exclusiveId)
        ) {
            onChange([exclusiveId]);
            return;
        }

        // 2. 普通项新选择 &rarr; 移除所有互斥项
        const hasNewNormal = checked.some(
            (v) =>
                !exclusiveOptions.includes(v) &&
                !checkboxValues.includes(v),
        );
        if (hasNewNormal) {
            onChange(
                checked.filter((v) => !exclusiveOptions.includes(v)),
            );
            return;
        }

        // 3. "其他"逻辑
        const wasOther = isOtherSelected;
        const isOtherNow = checked.includes('other');

        if (wasOther && !isOtherNow) {
            // 取消"其他"
            onChange(safeValue.filter((v) => !v.startsWith('other')));
            setOtherValue('');
        } else if (!wasOther && isOtherNow) {
            // 新选"其他"
            onChange([
                ...checked.filter((v) => v !== 'other'),
                `other:${otherValue}`,
            ]);
            setTimeout(() => otherInputRef.current?.focus(), 0);
        } else {
            // 其它正常勾选
            const otherOpt =
                safeValue.find((v) => v.startsWith('other:')) ??
                (isOtherNow ? `other:${otherValue}` : null);
            const newVals = checked.filter((v) => v !== 'other');
            if (otherOpt && isOtherNow) newVals.push(otherOpt);
            onChange(newVals);
        }
    };

    /* ---------- "其他"输入框 ---------- */
    const handleOtherInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const inp = e.target.value;
        setOtherValue(inp);

        if (isOtherSelected) {
            onChange([
                ...safeValue.filter(
                    (v) => v !== 'other' && !v.startsWith('other:'),
                ),
                `other:${inp}`,
            ]);
        }
    };

    /* 初始填充 otherValue */
    useEffect(() => {
        const other = safeValue.find((v) => v.startsWith('other:'));
        if (other) setOtherValue(other.slice(6));
        else if (isOtherSelected && !otherValue) {
            onChange([
                ...safeValue.filter((v) => v !== 'other'),
                'other:',
            ]);
        }
    }, [safeValue, isOtherSelected, otherValue, onChange]);

    /* ---------- 校验 ---------- */
    const validation = showValidation && typeof question.validate === 'function'
        ? question.validate(safeValue)
        : true;

    const isValid =
        typeof validation === 'boolean' ? validation : validation.isValid;
    const errorMessage =
        typeof validation === 'boolean' ? '' : validation.message;

    /* ---------- 选择限制文本 ---------- */
    const selLimit = (() => {
        const minSelected = question.minSelected || null;
        const maxSelected = question.maxSelected || null;
        if (minSelected && maxSelected)
            return `(请选择 ${minSelected} 至 ${maxSelected} 项)`;
        if (minSelected) return `(请至少选择 ${minSelected} 项)`;
        if (maxSelected) return `(请最多选择 ${maxSelected} 项)`;
        return '';
    })();

    /* ---------- 其他渲染辅助 ---------- */
    const columns = question.displayInColumns || 1;

    const StopPropagation: React.FC<{ children: React.ReactNode }> = ({
                                                                          children,
                                                                      }) => (
        <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );

    const renderOtherInput = () =>
        isOtherSelected ? (
            <>
                <Input
                    ref={otherInputRef}
                    value={otherValue}
                    onChange={handleOtherInputChange}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{width: '70%'}}
                    autoFocus
                />
            </>
        ) : null;

    // Helper function to check if option is exclusive
    const isExclusiveOption = (id: string) => {
        return exclusiveOptions.includes(id);
    };

    /* ---------- 选项渲染（单列 & 多列） ---------- */
    const renderOptions = () => {
        const group = (
            children: React.ReactNode,
            style?: React.CSSProperties,
        ) => (
            <Checkbox.Group
                onChange={handleCheckboxChange}
                value={checkboxValues}
                style={style}
            >
                {children}
            </Checkbox.Group>
        );

        if (columns === 1) {
            return group(
                <Space direction="vertical" style={{width: '100%'}}>
                    {displayOptions.map((opt) => (
                        <Checkbox
                            key={opt.id || opt.key}
                            value={opt.value}
                            disabled={
                                safeValue.some((v) =>
                                    exclusiveOptions.includes(v),
                                ) && !exclusiveOptions.includes(opt.id || opt.key)
                            }
                        >
                            {opt.text}
                            {isExclusiveOption(opt.id || opt.key) && (
                                <Tag color="blue" style={{marginLeft: 8}}>
                                    互斥选项
                                </Tag>
                            )}
                        </Checkbox>
                    ))}

                    {question.allowOther && (
                        <StopPropagation>
                            <Space>
                                <Checkbox
                                    value="other"
                                    disabled={safeValue.some((v) =>
                                        exclusiveOptions.includes(v),
                                    )}
                                >
                                    {question.otherText || "其他"}
                                </Checkbox>

                            </Space>
                        </StopPropagation>
                    )}
                </Space>,
            );
        }

        /* 多列 */
        return <>
            {group(
                <Row>
                    {displayOptions.map((opt) => (
                        <Col
                            span={24 / columns}
                            key={opt.id || opt.key}
                            style={{marginBottom: 8}}
                        >
                            <Checkbox
                                value={opt.id || opt.key}
                                disabled={
                                    safeValue.some((v) =>
                                        exclusiveOptions.includes(v),
                                    ) && !exclusiveOptions.includes(opt.id || opt.key)
                                }
                            >
                                {opt.text}
                                {isExclusiveOption(opt.id || opt.key) && (
                                    <Tag color="blue" style={{marginLeft: 8}}>
                                        互斥选项
                                    </Tag>
                                )}
                            </Checkbox>
                        </Col>
                    ))}
                    {question.allowOther && (
                        <StopPropagation>
                            <Space>
                                <Checkbox
                                    value="other"
                                    disabled={safeValue.some((v) =>
                                        exclusiveOptions.includes(v),
                                    )}
                                >
                                    {question.otherText || "其他"}
                                </Checkbox>

                            </Space>
                        </StopPropagation>
                    )}

                </Row>,
                {width: '100%'},
            )}

        </>
    };

    /* ---------- 最终 JSX ---------- */
    return (
        <div className="question-preview">
            <div className="question-title">
                {question.title}
                {question.isRequired && (
                    <span className="required-mark">*</span>
                )}
                <span className="selection-limit">{selLimit}</span>
            </div>

            {question.description && (
                <div className="question-description">
                    {question.description}
                </div>
            )}
            <Space direction={"vertical"} style={{width: "100%"}}>
                <Row>
                    {renderOptions()}
                </Row>
                <Row>
                    {renderOtherInput()}
                </Row>
            </Space>
            {showValidation && !isValid && (
                <Text type="danger">{errorMessage}</Text>
            )}
        </div>
    );
};

export default MultipleChoicePreviewComponent;