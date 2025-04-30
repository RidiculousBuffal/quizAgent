package com.dhu.dhusoftware.service;


import com.dhu.dhusoftware.dto.QuizAnswerDTO;
import com.dhu.dhusoftware.dto.SpecificAnswerDTO;
import com.dhu.dhusoftware.mapper.QuizQuestionAnswerMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class QuizQuestionAnswerService {

    @Resource
    private QuizQuestionAnswerMapper quizQuestionAnswerMapper;

    public int getTotalResponse (String userId) {
        return quizQuestionAnswerMapper.getTotalResponseByUserId(userId);
    }

    public int getSpecifiedResponseNum(String quizId) {
        return quizQuestionAnswerMapper.getSpecifiedResponseNum(quizId);
    }

    public List<QuizAnswerDTO> getAnswerListByQuizId (String quizId) {
        return quizQuestionAnswerMapper.getAnswerListByQuizId(quizId);
    }

    public List<SpecificAnswerDTO> getAnswerByUniqueSubmitId (String uniqueSubmitId) {
        List<SpecificAnswerDTO> specificAnswerDTOS = quizQuestionAnswerMapper.getAnswerByUniqueSubmitId(uniqueSubmitId);

        for (SpecificAnswerDTO dto : specificAnswerDTOS) {
            if (dto.questionDetails != null && dto.details != null) {
                try {
                    // Parse questionDetails JSON
                    ObjectMapper objectMapper = new ObjectMapper();
                    JsonNode questionDetailsNode = objectMapper.readTree(dto.questionDetails);
                    JsonNode optionsNode = questionDetailsNode.get("options");

                    // Parse details JSON (array of ids)
                    JsonNode detailsNode = objectMapper.readTree(dto.details);

                    // Map to store id -> text mapping
                    Map<String, String> idToTextMap = new HashMap<>();

                    // Build the mapping
                    if (optionsNode != null && optionsNode.isArray()) {
                        for (JsonNode option : optionsNode) {
                            String id = option.get("id").asText();
                            String text = option.get("text").asText();
                            idToTextMap.put(id, text);
                        }
                    }

                    // Create array of texts based on details ids
                    List<String> answerTexts = new ArrayList<>();
                    if (detailsNode.isArray()) {
                        for (JsonNode detailId : detailsNode) {
                            String id = detailId.asText();
                            String text = idToTextMap.get(id);
                            if (text != null) {
                                answerTexts.add(text);
                            }
                        }
                    }

                    // Set the answer field with JSON array of texts
                    if (!answerTexts.isEmpty()) {
                        dto.answer = objectMapper.writeValueAsString(answerTexts);
                    }

                } catch (Exception e) {
                    // Handle JSON parsing errors
                    e.printStackTrace();
                }
            }
        }

        return specificAnswerDTOS;

    }
}
