package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Userrole;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserRoleMapper {
    @Insert("INSERT INTO userrole(userId, roleId) VALUES (#{userId}, #{roleId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int addUserRole(Userrole userRole);

    @Delete("DELETE FROM userrole WHERE id = #{id}")
    int deleteUserRole(Long id);

    @Select("SELECT * FROM userrole WHERE userId = #{userId}")
    List<Userrole> listByUserId(String userId);

    @Select("SELECT * FROM userrole WHERE roleId = #{roleId}")
    List<Userrole> listByRoleId(Long roleId);
}