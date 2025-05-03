package com.dhu.dhusoftware.service;

import cn.dev33.satoken.stp.StpUtil;
import com.dhu.dhusoftware.service.AIService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.core.publisher.Flux;

import java.util.Date;

@SpringBootTest
public class TestAIService {
    @Autowired
    private AIService aiService;

    @Test
    public void TestAIStreamResponse() {
        Flux<ChatResponse> response = aiService.getResponse("gpt-4o-2024-11-20", "给我一段python判断素数的代码");
        response.doOnNext(x -> {
            if (x != null && x.getResult() != null && x.getResult().getOutput().getText() != null) {
                System.out.print(x.getResult().getOutput().getText());
            }
        }).blockLast(); // 简明调试用
    }

    @Test
    public void TestAIAnswer() throws JsonProcessingException {

        String model = "gpt-4.1";
        Long quizId = 25L;
        String question = "你建议的融资金额是多少呢";
        Long historyId = System.currentTimeMillis();
        Flux<String> stringFlux = aiService.getAIAnalysis(model, question, quizId, historyId, "ha1cwqjsdxj8");
        stringFlux.doOnNext(System.out::print).blockLast();
    }
}
