package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.service.QuestionTypeService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@RequestMapping("/api/questiontype")
public class QuestionTypeController {
    private QuestionTypeService questionTypeService;

    @GetMapping("/getAllQuestionTypes")
    public SaResult getQuestionTypes() {
        return SaResult.ok().setCode(COMMON.SUCCESS_CODE).setData(questionTypeService.ListAllQuestionTypes());
    }
}
