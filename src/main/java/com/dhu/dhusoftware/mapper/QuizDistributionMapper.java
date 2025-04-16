package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.QuizDistribution;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuizDistributionMapper {
    @Insert("INSERT INTO quizdistribution(quizId, distributionType, distributionTarget, distributionTime, status, creator) VALUES (#{quizId}, #{distributionType}, #{distributionTarget}, #{distributionTime}, #{status}, #{creator})")
    @Options(useGeneratedKeys = true, keyProperty = "distributionId")
    int addQuizDistribution(QuizDistribution distribution);

    @Select("SELECT * FROM quizdistribution WHERE distributionId = #{distributionId}")
    QuizDistribution getQuizDistributionById(Long distributionId);

    @Update("UPDATE quizdistribution SET distributionType = #{distributionType}, distributionTarget = #{distributionTarget}, status = #{status} WHERE distributionId = #{distributionId}")
    int updateQuizDistribution(QuizDistribution distribution);

    @Delete("DELETE FROM quizdistribution WHERE distributionId = #{distributionId}")
    int deleteQuizDistribution(Long distributionId);

    @Select("SELECT * FROM quizdistribution WHERE quizId = #{quizId}")
    List<QuizDistribution> listByQuizId(Long quizId);

    @Select("SELECT * FROM quizdistribution WHERE creator = #{creator}")
    List<QuizDistribution> listByCreator(String creator);
}