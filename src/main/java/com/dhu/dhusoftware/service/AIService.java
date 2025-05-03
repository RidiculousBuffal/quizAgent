package com.dhu.dhusoftware.service;

import cn.dev33.satoken.stp.StpUtil;
import com.dhu.dhusoftware.ai.prompt.AIQuestionPrompts;
import com.dhu.dhusoftware.mapper.AIAnswerHistoryMapper;
import com.dhu.dhusoftware.pojo.AIAnswerHistory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.*;

@Service
public class AIService {


    private final OpenAiApi openAiApi;
    private final QuizQuestionAnswerService quizQuestionAnswerService;
    private final AIAnswerHistoryMapper aiAnswerHistoryMapper;

    @Autowired
    public AIService(OpenAiApi openAiApi, QuizQuestionAnswerService quizQuestionAnswerService, AIAnswerHistoryMapper aiAnswerHistoryMapper) {
        this.openAiApi = openAiApi;
        this.quizQuestionAnswerService = quizQuestionAnswerService;
        this.aiAnswerHistoryMapper = aiAnswerHistoryMapper;
    }


    public Flux<ChatResponse> getResponse(String Model, String question) {
        var openaiChatOptions = OpenAiChatOptions.builder().model(Model).build();
        var chatModel = OpenAiChatModel.builder().openAiApi(this.openAiApi).defaultOptions(openaiChatOptions).build();
        Prompt prompt = new Prompt(new UserMessage(question));
        return chatModel.stream(prompt);
    }

    public List<Map<String, Object>> getAIAnalysisHistory(Long quizId) {
        String userId = StpUtil.getLoginIdAsString();
        List<AIAnswerHistory> aiAnswerHistories = aiAnswerHistoryMapper.ListHistory(quizId, userId);
        List<Map<String, Object>> res = new ArrayList<>();
        if (aiAnswerHistories == null) {
            return new ArrayList<>();
        } else {
            aiAnswerHistories.forEach(x -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("key", x.getHistoryId());
                userMap.put("role", "user");
                userMap.put("content", x.getInputParams());
                res.add(userMap);
                if (x.getGeneratedAnswers() != null) {
                    Map<String, Object> aiMap = new HashMap<>();
                    String uid = UUID.randomUUID().toString();
                    aiMap.put("key", uid);
                    aiMap.put("role", "ai");
                    aiMap.put("content", x.getGeneratedAnswers());
                    res.add(aiMap);
                }
            });
        }
        return res;
    }


    public Flux<String> getAIAnalysis(String Model, String question, Long quizId, Long historyId, String userId) throws JsonProcessingException {

        aiAnswerHistoryMapper.insertAIAnswerHistory(historyId, userId, quizId, question);
        //拿到问题历史
        List<AIAnswerHistory> aiAnswerHistories = aiAnswerHistoryMapper.ListHistory(quizId, userId);
        List<Message> messages = new ArrayList<>();
        // 拿到systemprompt
        List<Map<String, Object>> allAnswersInOneQuiz = quizQuestionAnswerService.getAllAnswersInOneQuiz(quizId);
        ObjectMapper objectMapper = new ObjectMapper();
        String jsondetails = objectMapper.writeValueAsString(allAnswersInOneQuiz);
        String systemPrompt = AIQuestionPrompts.getAIAnalysisPrompt(jsondetails);
        messages.add(new SystemMessage(systemPrompt));
        aiAnswerHistories.forEach(x -> {
            if (x.getInputParams() != null) {
                messages.add(new UserMessage(x.getInputParams()));
            }
            if (x.getGeneratedAnswers() != null) {
                messages.add(new AssistantMessage(x.getGeneratedAnswers()));
            }
        });
        var openaiChatOptions = OpenAiChatOptions.builder().model(Model).build();
        var chatModel = OpenAiChatModel.builder().openAiApi(this.openAiApi).defaultOptions(openaiChatOptions).build();
        Prompt prompt = new Prompt(messages);
        final String[] answer = {""};
        return chatModel.stream(prompt)
                .map(x -> {
                    String text = "";
                    if (x != null && x.getResult() != null && x.getResult().getOutput() != null) {
                        String t = x.getResult().getOutput().getText();
                        text = t != null ? t : "";
                    }
                    answer[0] += text;
                    aiAnswerHistoryMapper.updateAIAnswer(historyId, answer[0]);
                    return text;
                });
    }

}
