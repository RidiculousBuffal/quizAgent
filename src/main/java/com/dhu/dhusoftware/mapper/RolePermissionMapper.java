package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Rolepermission;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface RolePermissionMapper {
    @Insert("INSERT INTO rolepermission(permissionId, roleId) VALUES (#{permissionId}, #{roleId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int addRolePermission(Rolepermission rolePermission);

    @Delete("DELETE FROM rolepermission WHERE id = #{id}")
    int deleteRolePermission(Long id);

    @Select("SELECT * FROM rolepermission WHERE roleId = #{roleId}")
    List<Rolepermission> listByRoleId(Long roleId);

    @Select("SELECT * FROM rolepermission WHERE permissionId = #{permissionId}")
    List<Rolepermission> listByPermissionId(Long permissionId);
}