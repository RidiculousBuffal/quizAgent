package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.pojo.User;
import com.dhu.dhusoftware.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    // GET /user/autocomplete?keyword=dh
    @GetMapping("/autocomplete")
    public SaResult autocompleteUsers(@RequestParam String keyword) {
        List<User> users = userService.autocompleteUsers(keyword);
        return SaResult.ok().setData(users).setCode(COMMON.SUCCESS_CODE);
    }
}