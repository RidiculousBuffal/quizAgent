package com.dhu.dhusoftware.service;

import com.dhu.dhusoftware.service.question.BaseAIQuestionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class BaseQuestionTest {
    @Autowired
    private BaseAIQuestionService baseAIQuestionService;

    @Test
    public void testGenerateQuestion() {
        // 测试参数
        String userId = "ha1cwqjsdxj8";
        Long quizId = 2L;
        String question = "出一些历史方面的题目,1道单选题,1道多选题,1道填空题";
        String modelName = "gpt-4o-2024-11-20";

        // 调用服务方法
        try {
            Map<String, Object> result = baseAIQuestionService.generateQuestion(userId, quizId, question, modelName);

            // 打印结果以便调试
            System.out.println("AI Response: " + result.get("aiResponse"));
            if (result.containsKey("toolCallJson")) {
                System.out.println("Tool Call JSON: " + result.get("toolCallJson"));
            }

            // 基本断言检查
            assertNotNull(result, "Result should not be null");
            assertTrue(result.containsKey("aiResponse"), "Result should contain aiResponse key");
            assertFalse(result.get("aiResponse").toString().isEmpty(), "AI Response should not be empty");

        } catch (Exception e) {
            // 打印异常信息以便调试
            e.printStackTrace();
            throw new AssertionError("Test failed due to exception: " + e.getMessage());
        }
    }
}
