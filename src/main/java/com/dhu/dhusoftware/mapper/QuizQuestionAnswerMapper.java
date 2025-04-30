package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Quizquestionanswer;
import org.apache.ibatis.annotations.*;

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

    @Select("select count(distinct uniqueSubmitId) from quizquestionanswer, quiz where quiz.quizId = quizquestionanswer.quizId and creator = #{userId}")
    int getTotalResponseByUserId (String userId);
}