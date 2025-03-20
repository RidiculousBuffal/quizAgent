package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    @Insert("insert into user(userId, userName, userEmail, userAvatar) VALUES (#{userId},#{userName},#{userEmail},#{userAvatar})")
    public boolean addUser(User user);
}
