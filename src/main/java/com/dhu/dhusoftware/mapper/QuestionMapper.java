package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Question;
import com.dhu.dhusoftware.pojo.Questiontype;
import com.dhu.dhusoftware.pojo.Quizquestion;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuestionMapper {

    @Select("SELECT * FROM question WHERE questionId = #{questionId}")
    Question getQuestionById(Long questionId);

    @Update("UPDATE question SET questionName = #{questionName}, questionDescription = #{questionDescription}, questionDetails = #{questionDetails}, questionTypeId = #{questionTypeId} WHERE questionId = #{questionId}")
    int updateQuestion(Question question);

    @Delete("DELETE FROM question WHERE questionId = #{questionId}")
    int deleteQuestion(Long questionId);

    @Select("SELECT * FROM question")
    List<Question> listAllQuestions();

    @Insert("INSERT INTO question (questionName, questionDescription, questionDetails, questionTypeId) " +
            "VALUES (#{questionName}, #{questionDescription}, #{questionDetails}, #{questionTypeId})")
    @Options(useGeneratedKeys = true, keyProperty = "questionId")
    void insertQuestion(Question question);

    @Select("SELECT * FROM questiontype WHERE typeId = #{typeId}")
    Questiontype selectQuestionTypeById(Long typeId);

    @Select("SELECT COALESCE(MAX(sort), 0) + 1 FROM quizquestion WHERE quizId = #{quizId}")
    Long getNextSortByQuizId(Long quizId);

    @Insert("INSERT INTO quizquestion (quizId, questionId, sort) VALUES (#{quizId}, #{questionId}, #{sort})")
    void insertQuizQuestion(Quizquestion quizQuestion);
}