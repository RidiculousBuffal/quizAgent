package com.dhu.dhusoftware.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.sql.Timestamp;

/**
 * 问卷分发记录数据传输对象
 */
@Data
public class QuizDistributionDto {
    private Long distributionId;
    private Long quizId;
    private String distributionType;
    private String distributionTarget;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp distributionTime;
    private Boolean status;
    private String creator;
}