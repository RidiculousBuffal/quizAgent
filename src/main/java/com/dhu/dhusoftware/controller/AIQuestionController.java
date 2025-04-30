package com.dhu.dhusoftware.controller;

import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.pojo.Result;
import com.dhu.dhusoftware.mapper.AIGenerationHistoryMapper;
import com.dhu.dhusoftware.pojo.AIGenerationHistory;
import com.dhu.dhusoftware.service.question.StreamingAIQuestionService;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/question")
public class AIQuestionController {

    private final StreamingAIQuestionService streamingAIQuestionService;
    private final AIGenerationHistoryMapper historyMapper;

    @Autowired
    public AIQuestionController(StreamingAIQuestionService streamingAIQuestionService,
                                AIGenerationHistoryMapper historyMapper) {
        this.streamingAIQuestionService = streamingAIQuestionService;
        this.historyMapper = historyMapper;
    }


    @PostMapping(value = "/generate", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> generateQuestions(@RequestBody Map<String, Object> params) {
        String userId = StpUtil.getLoginIdAsString();
        Long quizId = Long.valueOf(params.get("quizId").toString());
        String question = (String) params.get("question");
        String modelName = (String) params.getOrDefault("modelName", "gpt-4.1");

        return streamingAIQuestionService.streamQuestion(userId, quizId, question, modelName);
    }


    @GetMapping("/history")
    public Result getAIGenerationHistory(
            @RequestParam("quizId") Long quizId) {
        String userId = StpUtil.getLoginIdAsString();
        List<AIGenerationHistory> history = historyMapper.listByUserIdAndQuizId(userId, quizId);
        return Result.success("获取历史记录成功", history);
    }
}