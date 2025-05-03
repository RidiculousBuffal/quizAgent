package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.AIAnswerHistory;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AIAnswerHistoryMapper {
    @Insert("insert into aianswerhistory(historyId, userId, quizId, inputParams) VALUES (#{historyId},#{userId},#{quizId},#{inputParams})")
    boolean insertAIAnswerHistory(Long historyId, String userId, Long quizId, String inputParams);

    @Select("select * from aianswerhistory where quizId=#{quizId} and userId=#{userId} order by historyId")
    List<AIAnswerHistory>ListHistory(Long quizId,String userId);

    @Update("update aianswerhistory set generatedAnswers = #{aiAnswer} where historyId = #{historyId}")
    boolean updateAIAnswer(Long historyId,String aiAnswer);
}