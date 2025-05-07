package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.apikey.SaApiKeyUtil;
import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.mapper.QuizMapper;
import com.dhu.dhusoftware.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mcpproxy")
@CrossOrigin
public class McpController {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private QuizMapper quizMapper;

    @GetMapping("/getMyInfo")
    public SaResult getUserInfo() {
        String apiKey = SaApiKeyUtil.currentApiKey().getApiKey();
        String userId = (String) SaApiKeyUtil.getLoginIdByApiKey(apiKey);
        return SaResult.ok().setCode(COMMON.SUCCESS_CODE).setData(userMapper.getUserById(userId));
    }

    @GetMapping("/getMyQuizes")
    public SaResult getMyQuizzes() {
        String apiKey = SaApiKeyUtil.currentApiKey().getApiKey();
        String userId = (String) SaApiKeyUtil.getLoginIdByApiKey(apiKey);
        return SaResult.ok().setCode(COMMON.SUCCESS_CODE).setData(quizMapper.listQuizzesByCreator(userId));
    }


}
