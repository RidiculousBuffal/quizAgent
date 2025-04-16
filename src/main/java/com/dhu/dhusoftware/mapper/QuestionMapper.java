package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Question;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuestionMapper {
    @Insert("INSERT INTO question(questionName, questionDescription, questionDetails, questionTypeId) VALUES (#{questionName}, #{questionDescription}, #{questionDetails}, #{questionTypeId})")
    @Options(useGeneratedKeys = true, keyProperty = "questionId")
    int addQuestion(Question question);

    @Select("SELECT * FROM question WHERE questionId = #{questionId}")
    Question getQuestionById(Long questionId);

    @Update("UPDATE question SET questionName = #{questionName}, questionDescription = #{questionDescription}, questionDetails = #{questionDetails}, questionTypeId = #{questionTypeId} WHERE questionId = #{questionId}")
    int updateQuestion(Question question);

    @Delete("DELETE FROM question WHERE questionId = #{questionId}")
    int deleteQuestion(Long questionId);

    @Select("SELECT * FROM question")
    List<Question> listAllQuestions();
}