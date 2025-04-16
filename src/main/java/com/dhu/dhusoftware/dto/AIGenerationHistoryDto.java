package com.dhu.dhusoftware.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.sql.Timestamp;

/**
 * AI问卷生成历史记录数据传输对象
 */
@Data
public class AIGenerationHistoryDto {
    private Long historyId;
    private String userId;
    private Long quizId;
    private String inputPrompt;
    private String generatedResult;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp generationTime;
    private Boolean status;
    private String errorMsg;
}