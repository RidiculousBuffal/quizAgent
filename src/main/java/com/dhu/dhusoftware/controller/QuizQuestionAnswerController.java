package com.dhu.dhusoftware.controller;


import cn.dev33.satoken.stp.StpUtil;
import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.constant.QuizConstants;
import com.dhu.dhusoftware.dto.QuizAnswerDTO;
import com.dhu.dhusoftware.dto.SpecificAnswerDTO;
import com.dhu.dhusoftware.service.QuizQuestionAnswerService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/quizQuestionAnswer")
public class QuizQuestionAnswerController {

    @Resource
    private QuizQuestionAnswerService quizQuestionAnswerService;

    @GetMapping("/getTotalResponse")
    public SaResult getTotalResponse() {
        try {
            String userId = StpUtil.getLoginIdAsString();
            int totalUser = quizQuestionAnswerService.getTotalResponse(userId);
            return SaResult.ok()
                    .setCode(COMMON.SUCCESS_CODE)
                    .setMsg(QuizConstants.SUCCESS_MSG)
                    .setData(totalUser);
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

    @GetMapping("/getSpecifiedResponseNum/{quizId}")
    public SaResult getSpecifiedResponseNum(@PathVariable String quizId) {
        try {
            String userId = StpUtil.getLoginIdAsString();
            int totalUser = quizQuestionAnswerService.getSpecifiedResponseNum(quizId);
            return SaResult.ok()
                    .setCode(COMMON.SUCCESS_CODE)
                    .setMsg(QuizConstants.SUCCESS_MSG)
                    .setData(totalUser);
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

    @GetMapping("/getAnswerListByQuizId/{quizId}")
    public SaResult getAnswerListByQuizId(@PathVariable String quizId) {
        try {
            List<QuizAnswerDTO> answerList = quizQuestionAnswerService.getAnswerListByQuizId(quizId);
            return SaResult.ok()
                    .setCode(COMMON.SUCCESS_CODE)
                    .setMsg(QuizConstants.SUCCESS_MSG)
                    .setData(answerList);
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

    @GetMapping("/getAnswerByUniqueSubmitId/{uniqueSubmitId}")
    public SaResult getAnswerByUniqueSubmitId(@PathVariable String uniqueSubmitId) {
        try {
            Map<String, Object> specificAnswerDTOS = quizQuestionAnswerService.getAnswerByUniqueSubmitId(uniqueSubmitId);
            return SaResult.ok()
                    .setCode(COMMON.SUCCESS_CODE)
                    .setMsg(QuizConstants.SUCCESS_MSG)
                    .setData(specificAnswerDTOS);
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
