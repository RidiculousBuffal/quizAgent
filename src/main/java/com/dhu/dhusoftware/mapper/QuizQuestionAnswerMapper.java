package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.dto.QuizAnswerDTO;
import com.dhu.dhusoftware.dto.SpecificAnswerDTO;
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

    @Select("select count(distinct uniqueSubmitId) from quizquestionanswer, quiz where quiz.quizId = quizquestionanswer.quizId and quiz.quizId = #{quizId}")
    int getSpecifiedResponseNum(String quizId);

    @Select("SELECT distinct qq.uniqueSubmitId, IFNULL(u.userName, '匿名用户') AS userName, qq.answerTime " +
            "FROM quizquestionanswer qq " +
            "LEFT JOIN user u ON u.userId = qq.answerUser " +
            "WHERE qq.quizId = #{quizId}")
    List<QuizAnswerDTO> getAnswerListByQuizId(String quizId);

    @Select("select quizquestionanswer.quizId,quizquestionanswer.details,user.userName from  quizquestionanswer left join user on quizquestionanswer.answerUser = user.userId  where quizquestionanswer.uniqueSubmitId=#{uniqueSubmitId}")
    List<SpecificAnswerDTO> getAnswerByUniqueSubmitId(String uniqueSubmitId);
}