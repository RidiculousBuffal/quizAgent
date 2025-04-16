package com.dhu.dhusoftware.dto;

import lombok.Data;

/**
 * 问题数据传输对象
 */
@Data
public class QuestionDto {
    private Long questionId;
    private String questionName;
    private String questionDescription;
    private String questionDetails;
    private Long questionTypeId;
}