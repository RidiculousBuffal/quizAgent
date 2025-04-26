package com.dhu.dhusoftware.dto;

import lombok.Data;

@Data
public class QuizPermissionDto {
    private Long id;
    private Long quizId;
    private Long quizPermissionTypeId;
    private String details;
}
