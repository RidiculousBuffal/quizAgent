package com.dhu.dhusoftware.dto;

import lombok.Data;

/**
 * 问卷问题关联数据传输对象
 */
@Data
public class QuizQuestionDto {
    private Long quizQuestionId;
    private Long quizId;
    private Long questionId;
    private Long sort;
}