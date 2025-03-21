package com.dhu.dhusoftware.service;

import com.dhu.dhusoftware.mapper.UserMapper;
import com.dhu.dhusoftware.pojo.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
            // 如果用户存在，执行更新
            userMapper.updateUser(user);
        } else {
            // 如果用户不存在，执行插入
            userMapper.addUser(user);
        }
    }
}