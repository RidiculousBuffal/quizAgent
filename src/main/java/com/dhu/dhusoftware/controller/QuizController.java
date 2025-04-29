package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.constant.QuizConstants;
import com.dhu.dhusoftware.dto.QuizDto;
import com.dhu.dhusoftware.dto.QuizQuestionDto;
import com.dhu.dhusoftware.mapper.QuizPermissionMapper;
import com.dhu.dhusoftware.pojo.Quiz;
import com.dhu.dhusoftware.pojo.Result;
import com.dhu.dhusoftware.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 问卷控制器，处理问卷创建、更新、删除等请求
 */
@RestController
@RequestMapping("/api/quiz")
@SaCheckLogin
public class QuizController {

    @Autowired
    private QuizService quizService;

    /**
     * 创建或更新问卷
     *
     * @param quizDto 问卷数据
     * @return SaResult 响应结果
     */
    @PostMapping("/save")
    public SaResult saveQuiz(@RequestBody QuizDto quizDto) {
        try {
            QuizDto resultDto = quizService.saveOrUpdateQuiz(quizDto);
            return SaResult.ok()
                    .setCode(COMMON.SUCCESS_CODE)
                    .setMsg(quizDto.getQuizId() == null ? QuizConstants.CREATE_SUCCESS : QuizConstants.UPDATE_SUCCESS)
                    .setData(resultDto);
        } catch (SecurityException e) {
            return SaResult.ok()
                    .setCode(COMMON.FAILURE_CODE)
                    .setMsg(QuizConstants.PERMISSION_DENIED_MSG);
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
     * 删除问卷
     *
     * @param quizId 问卷ID
     * @return SaResult 响应结果
     */
    @DeleteMapping("/{quizId}")
    public SaResult deleteQuiz(@PathVariable Long quizId) {
        try {
            boolean success = quizService.deleteQuiz(quizId);
            return SaResult.ok()
                    .setCode(success ? COMMON.SUCCESS_CODE : COMMON.FAILURE_CODE)
                    .setMsg(success ? QuizConstants.DELETE_SUCCESS : QuizConstants.FAILURE_MSG);
        } catch (SecurityException e) {
            return SaResult.ok()
                    .setCode(COMMON.FAILURE_CODE)
                    .setMsg(QuizConstants.PERMISSION_DENIED_MSG);
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
     * 获取问卷详情
     *
     * @param quizId 问卷ID
     * @return SaResult 响应结果
     */
    @GetMapping("/{quizId}")
    public Result getQuizById(@PathVariable Long quizId) {
        try {

            QuizDto quizDto = quizService.getQuizById(quizId);
            return Result.success(QuizConstants.SUCCESS_MSG, quizDto);
        } catch (IllegalArgumentException e) {
            return  Result.error(QuizConstants.FAILURE_MSG, null);
        } catch (Exception e) {
            return  Result.error(QuizConstants.FAILURE_MSG, null);
        }
    }

    /**
     * 获取当前用户的问卷列表
     *
     * @return SaResult 响应结果
     */
    @GetMapping("/my")
    public SaResult listMyQuizzes() {
        try {
            List<QuizDto> quizzes = quizService.listQuizzesByCurrentUser();
            return SaResult.ok()
                    .setCode(COMMON.SUCCESS_CODE)
                    .setMsg(QuizConstants.SUCCESS_MSG)
                    .setData(quizzes);
        } catch (Exception e) {
            return SaResult.ok()
                    .setCode(COMMON.FAILURE_CODE)
                    .setMsg(QuizConstants.FAILURE_MSG);
        }
    }

    /**
     * 批量更新问卷的问题列表（创建、更新、删除、排序）
     * 前端传递整个更新后的 questionAnswer 数组，answer 可为 null
     *
     * @param quizId       问卷ID
     * @param questionDtos 问题列表
     * @return SaResult 响应结果
     */
    @PostMapping("/{quizId}/questions")
    public SaResult updateQuizQuestions(@PathVariable Long quizId, @RequestBody List<QuizQuestionDto> questionDtos) {
        try {
            List<QuizQuestionDto> updatedDtos = quizService.updateQuizQuestions(quizId, questionDtos);
            return SaResult.ok()
                    .setCode(COMMON.FAILURE_CODE)
                    .setMsg(QuizConstants.UPDATE_SUCCESS)
                    .setData(updatedDtos);
        } catch (SecurityException e) {
            return SaResult.ok()
                    .setCode(COMMON.FAILURE_CODE)
                    .setMsg(QuizConstants.PERMISSION_DENIED_MSG);
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