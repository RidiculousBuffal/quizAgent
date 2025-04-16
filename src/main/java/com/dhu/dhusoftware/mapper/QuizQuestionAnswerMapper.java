package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Quizquestionanswer;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuizQuestionAnswerMapper {
    @Insert("INSERT INTO quizquestionanswer(quizId, questionId, details, answerUser) VALUES (#{quizId}, #{questionId}, #{details}, #{answerUser})")
    @Options(useGeneratedKeys = true, keyProperty = "answerId")
    int addQuizQuestionAnswer(Quizquestionanswer answer);

    @Select("SELECT * FROM quizquestionanswer WHERE answerId = #{answerId}")
    Quizquestionanswer getQuizQuestionAnswerById(Long answerId);

    @Delete("DELETE FROM quizquestionanswer WHERE answerId = #{answerId}")
    int deleteQuizQuestionAnswer(Long answerId);

    @Select("SELECT * FROM quizquestionanswer WHERE quizId = #{quizId}")
    List<Quizquestionanswer> listByQuizId(Long quizId);

    @Select("SELECT * FROM quizquestionanswer WHERE answerUser = #{answerUser} AND quizId = #{quizId}")
    List<Quizquestionanswer> listByUserAndQuiz(@Param("answerUser") String answerUser, @Param("quizId") Long quizId);
}