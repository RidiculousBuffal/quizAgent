package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.AIAnswerHistory;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AIAnswerHistoryMapper {
    @Insert("INSERT INTO aianswerhistory(userId, quizId, inputParams, generatedAnswers, generationTime, status, errorMsg, savedCount) VALUES (#{userId}, #{quizId}, #{inputParams}, #{generatedAnswers}, #{generationTime}, #{status}, #{errorMsg}, #{savedCount})")
    @Options(useGeneratedKeys = true, keyProperty = "historyId")
    int addAIAnswerHistory(AIAnswerHistory history);

    @Select("SELECT * FROM aianswerhistory WHERE historyId = #{historyId}")
    AIAnswerHistory getAIAnswerHistoryById(Long historyId);

    @Update("UPDATE aianswerhistory SET generatedAnswers = #{generatedAnswers}, status = #{status}, errorMsg = #{errorMsg}, savedCount = #{savedCount} WHERE historyId = #{historyId}")
    int updateAIAnswerHistory(AIAnswerHistory history);

    @Select("SELECT * FROM aianswerhistory WHERE userId = #{userId} ORDER BY generationTime DESC")
    List<AIAnswerHistory> listByUserId(String userId);

    @Select("SELECT * FROM aianswerhistory WHERE quizId = #{quizId} ORDER BY generationTime DESC")
    List<AIAnswerHistory> listByQuizId(Long quizId);
}