package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.dto.QuizDisplayDTO;
import com.dhu.dhusoftware.pojo.Quiz;
import com.dhu.dhusoftware.pojo.Quizpermission;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuizMapper {
    @Options(useGeneratedKeys = true, keyProperty = "quizId")
    @Insert("INSERT INTO quiz(quizName, quizDescription, quizStartTime, quizEndTime, status, creator) " +
            "VALUES (#{quizName}, #{quizDescription}, #{quizStartTime}, #{quizEndTime}, #{status}, #{creator})")
    int addQuiz(Quiz quiz);

    @Select("SELECT * FROM quiz WHERE quizId = #{quizId}")
    Quiz getQuizById(Long quizId);

    @Update("UPDATE quiz SET quizName = #{quizName}, quizDescription = #{quizDescription}, quizStartTime = #{quizStartTime}, quizEndTime = #{quizEndTime}, status = #{status} WHERE quizId = #{quizId}")
    int updateQuiz(Quiz quiz);

    @Delete("DELETE FROM quiz WHERE quizId = #{quizId}")
    int deleteQuiz(Long quizId);

    @Select("SELECT * FROM quiz WHERE creator = #{creator}")
    List<Quiz> listQuizzesByCreator(String creator);

    @Select("SELECT * FROM quiz")
    List<Quiz> listAllQuizzes();

    @Update("UPDATE quiz SET status = IF(NOW() BETWEEN quiz.quizStartTime AND quiz.quizEndTime, 1, 0)")
    void updateQuizStatusByTime();

    @Select("select quiz.creator from quiz, quizpermission where quiz.quizId = quizpermission.quizId and quizpermission.quizId = #{quizId}")
    String getCreatorFromQuizPermissionByQuizId(Quizpermission quizpermission);

    List<QuizDisplayDTO> listQuizDisplayInfo(@Param("value") String value);

}