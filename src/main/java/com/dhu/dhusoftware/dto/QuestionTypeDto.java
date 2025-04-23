package com.dhu.dhusoftware.dto;

import lombok.Data;

/**
 * 问题类型数据传输对象
 */
@Data
public class QuestionTypeDto {
    private Long typeId;
    private String typeName;
    private String description;
    private String typeSchema;
}