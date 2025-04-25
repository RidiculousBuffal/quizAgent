package com.dhu.dhusoftware.service;

import com.dhu.dhusoftware.service.question.StreamingAIQuestionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.core.Disposable;

@SpringBootTest
class StreamingQuestionTest {

    @Autowired
    private StreamingAIQuestionService streamingService;

    @Test
    void testStreamQuestion() {
        // ==== 测试参数 ====
        String userId = "ha1cwqjsdxj8";
        Long quizId = 2L;
        String question = "出一些历史方面的题目,1道单选题,1道多选题,1道填空题";
        String model = "gpt-4o-2024-11-20";

        // ==== 订阅流并实时打印 ====
        streamingService.streamQuestion(userId, quizId, question, model)
                .doOnNext(token -> System.out.print(token))   // 实时打印片段
                .doOnError(Throwable::printStackTrace)        // 打印异常
                .doOnComplete(() -> System.out.println("\n--- stream completed ---"))
                .blockLast();


    }
}