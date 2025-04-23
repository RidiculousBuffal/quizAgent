package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Role;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface RoleMapper {
    @Insert("INSERT INTO role(roleName) VALUES (#{roleName})")
    @Options(useGeneratedKeys = true, keyProperty = "roleId")
    int addRole(Role role);

    @Select("SELECT * FROM role WHERE roleId = #{roleId}")
    Role getRoleById(Long roleId);

    @Update("UPDATE role SET roleName = #{roleName} WHERE roleId = #{roleId}")
    int updateRole(Role role);

    @Delete("DELETE FROM role WHERE roleId = #{roleId}")
    int deleteRole(Long roleId);

    @Select("SELECT * FROM role")
    List<Role> listAllRoles();
}