package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Quizquestion;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuizQuestionMapper {
    @Insert("INSERT INTO quizquestion(quizId, questionId, sort) VALUES (#{quizId}, #{questionId}, #{sort})")
    @Options(useGeneratedKeys = true, keyProperty = "quizQuestionId")
    int addQuizQuestion(Quizquestion quizQuestion);

    @Select("SELECT * FROM quizquestion WHERE quizQuestionId = #{quizQuestionId}")
    Quizquestion getQuizQuestionById(Long quizQuestionId);

    @Update("UPDATE quizquestion SET sort = #{sort} WHERE quizQuestionId = #{quizQuestionId}")
    int updateQuizQuestion(Quizquestion quizQuestion);

    @Delete("DELETE FROM quizquestion WHERE quizQuestionId = #{quizQuestionId}")
    int deleteQuizQuestion(Long quizQuestionId);

    @Select("SELECT * FROM quizquestion WHERE quizId = #{quizId} ORDER BY sort")
    List<Quizquestion> listByQuizId(Long quizId);
}