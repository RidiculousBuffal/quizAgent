package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {
    @Insert("INSERT INTO user(userId, userName, userEmail, userAvatar) VALUES (#{userId},#{userName},#{userEmail},#{userAvatar})")
    boolean addUser(User user);

    @Select("SELECT * FROM user WHERE userId = #{userId}")
    User getUserById(String userId);

    @Update("UPDATE user SET userName = #{userName}, userEmail = #{userEmail}, userAvatar = #{userAvatar} " +
            "WHERE userId = #{userId}")
    boolean updateUser(User user);
}