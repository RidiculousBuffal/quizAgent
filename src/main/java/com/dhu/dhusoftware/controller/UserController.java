package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.dto.UserDto;
import com.dhu.dhusoftware.pojo.User;
import com.dhu.dhusoftware.service.UserService;
import org.springframework.beans.BeanUtils;
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

    @GetMapping("/getNameAndEmailById")
    public SaResult getNameAndEmailById(@RequestParam String userId) {
        UserDto userDto = new UserDto();
        userDto.setUserId(userId);
        User user = userService.getUserById(userId);
        if (user != null) {
            BeanUtils.copyProperties(user, userDto);
            return SaResult.ok().setData(userDto).setCode(COMMON.SUCCESS_CODE);
        } else {
            return SaResult.error().setCode(COMMON.FAILURE_CODE).setMsg("无效的用户ID");
        }
    }
}