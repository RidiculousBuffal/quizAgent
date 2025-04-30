package com.dhu.dhusoftware.service;


import com.dhu.dhusoftware.mapper.QuizQuestionAnswerMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class QuizQuestionAnswerService {

    @Resource
    private QuizQuestionAnswerMapper quizQuestionAnswerMapper;

    public int getTotalResponse (String userId) {
        return quizQuestionAnswerMapper.getTotalResponseByUserId(userId);
    }
}
