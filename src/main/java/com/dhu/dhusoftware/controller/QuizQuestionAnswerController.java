package com.dhu.dhusoftware.controller;


import cn.dev33.satoken.stp.StpUtil;
import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.constant.QuizConstants;
import com.dhu.dhusoftware.pojo.Quizpermission;
import com.dhu.dhusoftware.service.QuizQuestionAnswerService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/quizquestionanswer")
public class QuizQuestionAnswerController {

    @Resource
    private QuizQuestionAnswerService quizQuestionAnswerService;

    @GetMapping("/gettotalresponse")
    public SaResult getTotalResponse (){
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
}
