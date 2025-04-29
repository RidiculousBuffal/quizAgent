package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Quizquestionanswer;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QuizQuestionAnswerMapper {

    /**
     * Insert a single quiz question answer
     */
    int insertQuizQuestionAnswer(Quizquestionanswer quizQuestionAnswer);

    /**
     * Batch insert multiple quiz question answers
     */
    int batchInsertQuizQuestionAnswers(@Param("answers") List<Quizquestionanswer> answers);
}