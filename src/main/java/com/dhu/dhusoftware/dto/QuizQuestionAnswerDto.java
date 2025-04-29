package com.dhu.dhusoftware.dto;

import lombok.Data;

/**
 * 问卷问题答案数据传输对象
 */
@Data
public class QuizQuestionAnswerDto {
    private Long questionId;
    private Object answer;
}