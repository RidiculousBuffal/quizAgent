package com.dhu.dhusoftware.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizSubmissionDTO {
    private Long quizId;
    private List<QuizQuestionAnswerDto> answers;
}