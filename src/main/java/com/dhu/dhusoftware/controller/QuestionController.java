package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.constant.QuizConstants;
import com.dhu.dhusoftware.dto.QuestionDto;
import com.dhu.dhusoftware.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
     * @param questionDto 问题数据
     * @return SaResult 响应结果
     */
    @PostMapping("/save")
    public SaResult saveQuestion(@RequestBody QuestionDto questionDto) {
        try {
            QuestionDto resultDto = questionService.saveOrUpdateQuestion(questionDto);
            return SaResult.ok()
                    .setCode(COMMON.SUCCESS_CODE)
                    .setMsg(questionDto.getQuestionId() == null ? QuizConstants.CREATE_SUCCESS : QuizConstants.UPDATE_SUCCESS)
                    .setData(resultDto);
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

    /**
     * 删除问题
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

    /**
     * 获取问题详情
     * @param questionId 问题ID
     * @return SaResult 响应结果
     */
    @GetMapping("/{questionId}")
    public SaResult getQuestionById(@PathVariable Long questionId) {
        try {
            QuestionDto questionDto = questionService.getQuestionById(questionId);
            return SaResult.ok()
                    .setCode(COMMON.FAILURE_CODE)
                    .setMsg(QuizConstants.SUCCESS_MSG)
                    .setData(questionDto);
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

    /**
     * 获取所有问题列表
     * @return SaResult 响应结果
     */
    @GetMapping("/list")
    public SaResult listAllQuestions() {
        try {
            List<QuestionDto> questions = questionService.listAllQuestions();
            return SaResult.ok()
                    .setCode(COMMON.SUCCESS_CODE)
                    .setMsg(QuizConstants.SUCCESS_MSG)
                    .setData(questions);
        } catch (Exception e) {
            return SaResult.ok()
                    .setCode(COMMON.FAILURE_CODE)
                    .setMsg(QuizConstants.FAILURE_MSG);
        }
    }
}