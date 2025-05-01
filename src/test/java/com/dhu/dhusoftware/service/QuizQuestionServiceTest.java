package com.dhu.dhusoftware.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class QuizQuestionServiceTest {
    @Autowired
    QuizQuestionAnswerService quizQuestionAnswerService;
    @Test
    public void checkRes() throws JsonProcessingException {
        var x = quizQuestionAnswerService.getAllAnswersInOneQuiz(2L);
        System.out.println(x);
    }
}
