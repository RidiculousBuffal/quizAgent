package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.constant.QuizConstants;
import com.dhu.dhusoftware.dto.QuizDisplayDTO;
import com.dhu.dhusoftware.dto.QuizSubmissionDTO;
import com.dhu.dhusoftware.pojo.Result;
import com.dhu.dhusoftware.service.QuizService;
import com.dhu.dhusoftware.service.QuizSubmissionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/public/quiz")
public class PublicQuizController {

    private static final Logger logger = LoggerFactory.getLogger(PublicQuizController.class);

    @Autowired
    private QuizSubmissionService quizSubmissionService;

    @Autowired
    private QuizService quizService;

    @PostMapping("/submit")
    public Result submitQuizAnswers(@RequestBody QuizSubmissionDTO submission) {
        logger.info("Received quiz submission for quiz ID: {}", submission.getQuizId());

        // Validate submission data
        if (submission == null || submission.getQuizId() == null ||
                submission.getAnswers() == null || submission.getAnswers().isEmpty()) {
            logger.warn("Invalid quiz submission data");
            return Result.error("提交数据不完整", null);
        }

        try {
            // Process submission
            Map<String, Object> result = quizSubmissionService.submitQuizAnswers(submission);

            if ((Boolean) result.get("success")) {
                logger.info("Quiz submission successful: {}", result);
                return Result.success(QuizConstants.SUCCESS_MSG, result);
            } else {
                logger.warn("Quiz submission failed: {}", result);
                return Result.error("提交问卷时发生错误", null);
            }
        } catch (Exception e) {
            logger.error("Error processing quiz submission: {}", e.getMessage(), e);
            return Result.error(e.getMessage(), null);
        }
    }

    /**
     * @return 返回public的quiz列表(参数可选，为过滤list存在)
     */
    @PostMapping("/getAllQuizList")
    public Result getAllQuizList(@RequestBody(required = false) String value) {
        try {
            List<QuizDisplayDTO> quizDisplayDTOList = quizService.getQuizDisplay(value);
            return Result.success("这就是数据表!!", quizDisplayDTOList);
        } catch (Exception e) {
            logger.error(String.valueOf(e));
            return Result.error(String.valueOf(e), 1);
        }
    }
}