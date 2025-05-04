package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {
    @Insert("INSERT INTO user(userId, userName, userEmail, userAvatar) VALUES (#{userId},#{userName},#{userEmail},#{userAvatar})")
    boolean addUser(User user);

    @Select("SELECT * FROM user WHERE userId = #{userId}")
    User getUserById(String userId);

    @Update("UPDATE user SET userName = #{userName}, userEmail = #{userEmail}, userAvatar = #{userAvatar} WHERE userId = #{userId}")
    boolean updateUser(User user);

    @Update("update user set userAvatar = #{url} where userId=#{userId}")
    boolean updateUserAvatar(String url,String userId);
    // 自动补全接口: 用户ID/名字模糊查询，前5条
    @Select("SELECT * FROM user WHERE userName LIKE CONCAT('%',#{keyword},'%') OR userId LIKE CONCAT('%',#{keyword},'%') LIMIT 5")
    List<User> searchUsersForAutocomplete(@Param("keyword") String keyword);
}