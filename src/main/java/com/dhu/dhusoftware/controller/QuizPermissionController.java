package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.constant.QuizConstants;
import com.dhu.dhusoftware.dto.QuizPermissionDto;
import com.dhu.dhusoftware.pojo.Quizpermission;
import com.dhu.dhusoftware.service.QuizPermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/quizpermission")
public class QuizPermissionController {

    @Autowired
    private QuizPermissionService quizPermissionService;

    /**
     * 根据quizId查看
     *
     * @param quizId 问卷ID
     * @return SaResult
     */
    @GetMapping("/details/{quizId}")
    public SaResult getQuizPermissionDetails(@PathVariable Long quizId) {
        try {
            Quizpermission quizPermissionDto = quizPermissionService.getPermissionByQuizId(quizId);
            return SaResult.ok()
                    .setCode(COMMON.SUCCESS_CODE)
                    .setMsg(QuizConstants.SUCCESS_MSG)
                    .setData(quizPermissionDto);
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
     * 根据quizId获取当前用户/游客是否有权限访问该
     *
     * @param quizId 问卷ID
     * @return SaResult
     */
    @GetMapping("/public/check/{quizId}")
    public SaResult checkPermission(@PathVariable Long quizId) {
        try {
            Boolean permission = quizPermissionService.hasPermission(quizId);
            return SaResult.ok()
                    .setCode(COMMON.SUCCESS_CODE)
                    .setMsg(QuizConstants.SUCCESS_MSG)
                    .setData(permission);
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

    @PostMapping("/save")
    public SaResult updateOrInsertQuizPermission(@RequestBody QuizPermissionDto quizPermissionDto) {
        try {
            QuizPermissionDto resultDto = quizPermissionService.updateOrInsertQuizPermission(quizPermissionDto);
            return SaResult.ok()
                    .setCode(COMMON.SUCCESS_CODE)
                    .setMsg(quizPermissionDto.getId() == null ? QuizConstants.CREATE_SUCCESS : QuizConstants.UPDATE_SUCCESS)
                    .setData(resultDto);
        }catch (SecurityException e) {
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

    @DeleteMapping("/{quizId}")
    public SaResult deleteQuizPermission(@PathVariable Long quizId) {
        try {
            boolean success = quizPermissionService.deleteQuizPermission(quizId);
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
}