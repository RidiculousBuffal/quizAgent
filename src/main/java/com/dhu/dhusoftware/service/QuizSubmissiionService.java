package com.dhu.dhusoftware.service;

import cn.dev33.satoken.stp.StpUtil;
import com.dhu.dhusoftware.dto.QuizSubmissionDTO;
import com.dhu.dhusoftware.mapper.QuizQuestionAnswerMapper;
import com.dhu.dhusoftware.pojo.Quizquestionanswer;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QuizSubmissionService {

    private static final Logger logger = LoggerFactory.getLogger(QuizSubmissionService.class);

    @Autowired
    private QuizQuestionAnswerMapper quizQuestionAnswerMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public Map<String, Object> submitQuizAnswers(QuizSubmissionDTO submission) {
        // Result map to return stats and status
        Map<String, Object> result = new HashMap<>();
        result.put("totalQuestions", submission.getAnswers().size());
        result.put("savedAnswers", 0);

        // Get current user ID from SA-Token if logged in, null otherwise
        String currentUserId = null;
        try {
            if (StpUtil.isLogin()) {
                currentUserId = StpUtil.getLoginIdAsString();
                logger.info("User logged in with ID: {}", currentUserId);
            } else {
                logger.info("Anonymous submission");
            }
        } catch (Exception e) {
            logger.warn("Error checking login status: {}", e.getMessage());
        }

        List<Quizquestionanswer> answers = new ArrayList<>();

        // Process each answer
        for (QuizSubmissionDTO.QuestionAnswerDTO answerDTO : submission.getAnswers()) {
            if (answerDTO.getQuestionId() == null) {
                logger.warn("Skipping answer with null questionId");
                continue;
            }

            Quizquestionanswer answer = new Quizquestionanswer();
            answer.setQuizId(submission.getQuizId());
            answer.setQuestionId(answerDTO.getQuestionId());
            answer.setAnswerUser(currentUserId); // Will be null for anonymous users

            // Convert answer to JSON string
            try {
                String details = objectMapper.writeValueAsString(answerDTO.getAnswer());
                answer.setDetails(details);
            } catch (Exception e) {
                logger.error("Failed to convert answer to JSON: {}", e.getMessage());
                // Store as plain string if JSON conversion fails
                answer.setDetails(String.valueOf(answerDTO.getAnswer()));
            }

            answers.add(answer);
        }

        // Save answers to database
        int savedCount = 0;
        if (!answers.isEmpty()) {
            try {
                // Try batch insert first
                savedCount = quizQuestionAnswerMapper.batchInsertQuizQuestionAnswers(answers);
                logger.info("Batch inserted {} answers", savedCount);
            } catch (Exception e) {
                logger.warn("Batch insert failed, falling back to individual inserts: {}", e.getMessage());

                // Fall back to individual inserts
                for (Quizquestionanswer answer : answers) {
                    try {
                        int inserted = quizQuestionAnswerMapper.insertQuizQuestionAnswer(answer);
                        if (inserted > 0) {
                            savedCount++;
                        }
                    } catch (Exception ex) {
                        logger.error("Failed to insert answer for question {}: {}",
                                answer.getQuestionId(), ex.getMessage());
                    }
                }
            }
        }

        // Update result with saved count
        result.put("savedAnswers", savedCount);
        result.put("success", savedCount > 0);
        result.put("submittedBy", currentUserId != null ? currentUserId : "anonymous");

        return result;
    }
}