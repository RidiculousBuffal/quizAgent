package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.constant.QuizConstants;
import com.dhu.dhusoftware.dto.QuizSubmissionDTO;
import com.dhu.dhusoftware.service.QuizSubmissionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/public/quiz")
public class PublicQuizController {

    private static final Logger logger = LoggerFactory.getLogger(PublicQuizController.class);

    @Autowired
    private QuizSubmissionService quizSubmissionService;

    /**
     * Submit quiz answers (accessible to both authenticated and anonymous users)
     *
     * @param submission the quiz submission data containing quizId and answers
     * @return SaResult with status and submission details
     */
    @PostMapping("/submit")
    public SaResult submitQuizAnswers(@RequestBody QuizSubmissionDTO submission) {
        logger.info("Received quiz submission for quiz ID: {}", submission.getQuizId());

        // Validate submission data
        if (submission == null || submission.getQuizId() == null ||
                submission.getAnswers() == null || submission.getAnswers().isEmpty()) {
            logger.warn("Invalid quiz submission data");
            return SaResult.error("提交的数据不完整")
                    .setCode(COMMON.FAILURE_CODE);
        }

        try {
            // Process submission
            Map<String, Object> result = quizSubmissionService.submitQuizAnswers(submission);

            if ((Boolean) result.get("success")) {
                logger.info("Quiz submission successful: {}", result);
                return SaResult.ok("问卷提交成功")
                        .setCode(COMMON.SUCCESS_CODE)
                        .setData(result);
            } else {
                logger.warn("Quiz submission failed: {}", result);
                return SaResult.error("提交问卷时发生错误")
                        .setCode(COMMON.FAILURE_CODE)
                        .setData(result);
            }
        } catch (Exception e) {
            logger.error("Error processing quiz submission: {}", e.getMessage(), e);
            return SaResult.error("系统错误：" + e.getMessage())
                    .setCode(COMMON.FAILURE_CODE);
        }
    }
}