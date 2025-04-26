package com.dhu.dhusoftware.dto;

import com.dhu.dhusoftware.pojo.Question;
import com.dhu.dhusoftware.pojo.Questiontype;
import lombok.Data;


@Data
public class QuizQuestionDetailDTO {

    /**
     * quizquestion 表字段
     */
    private Long quizQuestionId;
    private Long quizId;
    private Long sort;

    /**
     * question 表对象
     */
    private Question question;

    /**
     * questiontype 表对象
     */
    private Questiontype questionType;
}