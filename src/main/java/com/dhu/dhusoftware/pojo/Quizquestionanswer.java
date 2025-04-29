package com.dhu.dhusoftware.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Quizquestionanswer {

    private long answerId;
    private long quizId;
    private long questionId;
    private String details;
    private String answerUser;

}
