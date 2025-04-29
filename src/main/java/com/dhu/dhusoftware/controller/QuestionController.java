package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.constant.QuizConstants;
import com.dhu.dhusoftware.dto.QuestionDto;
import com.dhu.dhusoftware.dto.QuizQuestionDetailDTO;
import com.dhu.dhusoftware.pojo.Result;
import com.dhu.dhusoftware.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

/**
 * 问题控制器，处理问题创建、更新、删除等请求
 */
@RestController
@RequestMapping("/api/question")
@SaCheckLogin
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    /**
     * 创建或更新问题
     *
     * @return SaResult 响应结果
     */
    @PostMapping("/save/{quizId}")
    public SaResult saveQuestion(@PathVariable("quizId") Long quizId, @RequestBody ArrayList<Map<String, Object>> payload) {
        return SaResult.ok().setCode(COMMON.SUCCESS_CODE).setData(questionService.saveOrUpdateQuestion(payload, quizId));
    }

    @GetMapping("/listQuestions/{quizId}")
    public Result listQuestions(@PathVariable("quizId") Long quizId) {
        try {
            return Result.success(null, questionService.getQuizQuestionDetailsByQuizId(quizId));
        } catch (Exception e) {
            return Result.error(e.getMessage(), null);
        }
    }

    /**
     * 删除问题
     *
     * @param questionId 问题ID
     * @return SaResult 响应结果
     */
    @DeleteMapping("/{questionId}")
    public SaResult deleteQuestion(@PathVariable Long questionId) {
        try {
            boolean success = questionService.deleteQuestion(questionId);
            return SaResult.ok()
                    .setCode(success ? COMMON.SUCCESS_CODE : COMMON.FAILURE_CODE)
                    .setMsg(success ? QuizConstants.DELETE_SUCCESS : QuizConstants.FAILURE_MSG);
        } catch (IllegalArgumentException e) {
            return SaResult.ok()
                    .setCode(COMMON.FAILURE_CODE)
                    .setMsg(e.getMessage());
        } catch (Exception e) {
            return SaResult.ok()
                    .setCode(COMMON.FAILURE_CODE)
                    .setMsg(QuizConstants.FAILURE_MSG);
        }
    }
}