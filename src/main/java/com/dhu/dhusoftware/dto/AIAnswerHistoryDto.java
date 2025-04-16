package com.dhu.dhusoftware.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.sql.Timestamp;

/**
 * AI问卷作答历史记录数据传输对象
 */
@Data
public class AIAnswerHistoryDto {
    private Long historyId;
    private String userId;
    private Long quizId;
    private String inputParams;
    private String generatedAnswers;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp generationTime;
    private Boolean status;
    private String errorMsg;
    private Integer savedCount;
}