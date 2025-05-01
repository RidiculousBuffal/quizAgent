package com.dhu.dhusoftware.service;


import cn.dev33.satoken.stp.StpUtil;
import com.dhu.dhusoftware.dto.AnswerResponse;
import com.dhu.dhusoftware.dto.QuizAnswerDTO;
import com.dhu.dhusoftware.dto.QuizDto;
import com.dhu.dhusoftware.dto.SpecificAnswerDTO;
import com.dhu.dhusoftware.mapper.QuizQuestionAnswerMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.LongBuffer;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class QuizQuestionAnswerService {

    @Resource
    private QuizQuestionAnswerMapper quizQuestionAnswerMapper;
    @Autowired
    private QuestionService questionService;

    public int getTotalResponse(String userId) {
        return quizQuestionAnswerMapper.getTotalResponseByUserId(userId);
    }

    public int getSpecifiedResponseNum(String quizId) {
        return quizQuestionAnswerMapper.getSpecifiedResponseNum(quizId);
    }

    public List<QuizAnswerDTO> getAnswerListByQuizId(String quizId) {
        return quizQuestionAnswerMapper.getAnswerListByQuizId(quizId);
    }

    public List<Map<String, Object>> getAllAnswersInOneQuiz(Long quizId) throws JsonProcessingException {
        List<Map<String, Object>> questions = questionService.getQuizQuestionDetailsByQuizId(quizId);
        List<Map<String, Object>> res = new ArrayList<>();
        questions.forEach(x -> {
            Map<String, Object> inner = new HashMap<>();
            inner.put("question", x);
            Long questionId = (Long) x.get("id");
            List<AnswerResponse> allAnswersInOneQuizByQuizIdAndQuestionId = quizQuestionAnswerMapper.getAllAnswersInOneQuizByQuizIdAndQuestionId(quizId, questionId);
            List<Map<String, Object>> answers = new ArrayList<>();
            final Long[] cnt = {1L};
            allAnswersInOneQuizByQuizIdAndQuestionId.forEach(y -> {
                if (y.getUsername() == null) {
                    y.setUsername("匿名用户 " + cnt[0]);
                    cnt[0]++;
                }
                answers.add(y.getMap());
            });
            inner.put("answers", answers);
            res.add(inner);
        });
        return res;
    }

    public List<QuizDto> getQuizzesHasResp() {
        String userId = StpUtil.getLoginIdAsString();
        return quizQuestionAnswerMapper.getQuizzesHasResp(userId);
    }

    public Map<String, Object> getAnswerByUniqueSubmitId(String uniqueSubmitId) throws JsonProcessingException {
        List<SpecificAnswerDTO> specificAnswerDTOS = quizQuestionAnswerMapper.getAnswerByUniqueSubmitId(uniqueSubmitId);
        Map<String, Object> questionAnswers = new HashMap<>();
        if (!specificAnswerDTOS.isEmpty()) {
            Long quizId = specificAnswerDTOS.getFirst().getQuizId();
            List<Map<String, Object>> questions = questionService.getQuizQuestionDetailsByQuizId(quizId);
            List<String> answers = specificAnswerDTOS.stream().map(SpecificAnswerDTO::getDetails).toList();
            questionAnswers.put("question", questions);
            questionAnswers.put("answer", answers);
            questionAnswers.put("user", specificAnswerDTOS.getFirst().getUserName());
        } else {
            questionAnswers.put("question", new ArrayList<>());
            questionAnswers.put("answer", new ArrayList<>());
            questionAnswers.put("user", null);
        }
        return questionAnswers;

//
//        for (SpecificAnswerDTO dto : specificAnswerDTOS) {
//            if (dto.questionDetails != null && dto.details != null) {
//                try {
//                    // Parse questionDetails JSON
//                    ObjectMapper objectMapper = new ObjectMapper();
//                    JsonNode questionDetailsNode = objectMapper.readTree(dto.questionDetails);
//                    JsonNode optionsNode = questionDetailsNode.get("options");
//
//                    // Parse details JSON (array of ids)
//                    JsonNode detailsNode = objectMapper.readTree(dto.details);
//
//                    // Map to store id -> text mapping
//                    Map<String, String> idToTextMap = new HashMap<>();
//
//                    // Build the mapping
//                    if (optionsNode != null && optionsNode.isArray()) {
//                        for (JsonNode option : optionsNode) {
//                            String id = option.get("id").asText();
//                            String text = option.get("text").asText();
//                            idToTextMap.put(id, text);
//                        }
//                    }
//
//                    // Create array of texts based on details ids
//                    List<String> answerTexts = new ArrayList<>();
//                    if (detailsNode.isArray()) {
//                        for (JsonNode detailId : detailsNode) {
//                            String id = detailId.asText();
//                            String text = idToTextMap.get(id);
//                            if (text != null) {
//                                answerTexts.add(text);
//                            }
//                        }
//                    }
//
//                    // Set the answer field with JSON array of texts
//                    if (!answerTexts.isEmpty()) {
//                        dto.answer = objectMapper.writeValueAsString(answerTexts);
//                    }
//
//                } catch (Exception e) {
//                    // Handle JSON parsing errors
//                    e.printStackTrace();
//                }
//            }
//        }
//
//        return specificAnswerDTOS;

    }
}
