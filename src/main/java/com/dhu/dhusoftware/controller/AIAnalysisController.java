package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.stp.StpUtil;
import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.dto.AIAnalysisDTO;
import com.dhu.dhusoftware.service.AIService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@CrossOrigin
@RequestMapping("/analysis")
public class AIAnalysisController {
    @Autowired
    private AIService aiService;

    @GetMapping("/getAIAnalysis/{quizId}")
    public SaResult getAIAnalysisHistory(@PathVariable("quizId") Long quizId) {
        return SaResult.ok().setCode(COMMON.SUCCESS_CODE).setData(aiService.getAIAnalysisHistory(quizId));
    }

    @PostMapping(value = "/generateAnalysis", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> generateAnalysis(@RequestBody AIAnalysisDTO aiAnalysisDTO) throws JsonProcessingException {
        try {
            String userId = StpUtil.getLoginIdAsString();
            return aiService.getAIAnalysis(aiAnalysisDTO.getModel(), aiAnalysisDTO.getQuestion(), aiAnalysisDTO.getQuizId(), aiAnalysisDTO.getHistoryId(), userId);
        } catch (Exception e) {
            return Flux.just("");
        }
    }
}
