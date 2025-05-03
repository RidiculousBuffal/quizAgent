package com.dhu.dhusoftware.dto;

import lombok.Data;

@Data
public class AIAnalysisDTO {
    String model;
    String question;
    Long quizId;
    Long historyId;
    String userId;
}
