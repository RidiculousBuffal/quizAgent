package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.AIGenerationHistory;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AIGenerationHistoryMapper {
    @Insert("INSERT INTO aigenerationhistory(userId, quizId, inputPrompt, generatedResult, generationTime, status, errorMsg) VALUES (#{userId}, #{quizId}, #{inputPrompt}, #{generatedResult}, #{generationTime}, #{status}, #{errorMsg})")
    @Options(useGeneratedKeys = true, keyProperty = "historyId")
    int addAIGenerationHistory(AIGenerationHistory history);

    @Select("SELECT * FROM aigenerationhistory WHERE historyId = #{historyId}")
    AIGenerationHistory getAIGenerationHistoryById(Long historyId);

    @Update("UPDATE aigenerationhistory SET quizId = #{quizId}, generatedResult = #{generatedResult}, status = #{status}, errorMsg = #{errorMsg} WHERE historyId = #{historyId}")
    int updateAIGenerationHistory(AIGenerationHistory history);

    @Select("SELECT * FROM aigenerationhistory WHERE userId = #{userId} ORDER BY generationTime DESC")
    List<AIGenerationHistory> listByUserId(String userId);

    @Select("SELECT * FROM aigenerationhistory WHERE quizId = #{quizId}")
    List<AIGenerationHistory> listByQuizId(Long quizId);
}