package com.dhu.dhusoftware.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.sql.Timestamp;

/**
 * 问卷数据传输对象
 */
@Data
public class QuizDto {
    private Long quizId;
    private String quizName;
    private String quizDescription;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp quizStartTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp quizEndTime;
    private Boolean status;
    private String creator;
}