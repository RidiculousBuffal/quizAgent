package com.dhu.dhusoftware.service;

import com.dhu.dhusoftware.service.AIService;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.core.publisher.Flux;

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
}
