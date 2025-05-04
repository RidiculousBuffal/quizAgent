package com.dhu.dhusoftware.service;

import cn.dev33.satoken.stp.StpUtil;
import com.dhu.dhusoftware.dto.UserDto;
import com.dhu.dhusoftware.mapper.UserMapper;
import com.dhu.dhusoftware.pojo.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {
    private final UserMapper userMapper;

    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Transactional
    public void saveOrUpdateUser(User user) {
        User existingUser = userMapper.getUserById(user.getUserId());
        if (existingUser != null) {
            // 如果用户存在，执行更新 不更新头像
            user.setUserAvatar(existingUser.getUserAvatar());
            userMapper.updateUser(user);
        } else {
            // 如果用户不存在，执行插入
            userMapper.addUser(user);
        }
    }

    // 自动补全服务
    public List<User> autocompleteUsers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        return userMapper.searchUsersForAutocomplete(keyword);
    }

    // 通过id获取姓名邮箱
    public User getUserById(String userId) {
        return userMapper.getUserById(userId);
    }

    public boolean updateUserAvatar(String url) {
        String userId = StpUtil.getLoginIdAsString();
        return userMapper.updateUserAvatar(url, userId);
    }
}