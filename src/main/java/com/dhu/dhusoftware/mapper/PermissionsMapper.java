package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Permissions;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PermissionsMapper {
    @Insert("INSERT INTO permissions(permissionScope, permissionDescription) VALUES (#{permissionScope}, #{permissionDescription})")
    @Options(useGeneratedKeys = true, keyProperty = "permissionId")
    int addPermission(Permissions permission);

    @Select("SELECT * FROM permissions WHERE permissionId = #{permissionId}")
    Permissions getPermissionById(Long permissionId);

    @Update("UPDATE permissions SET permissionScope = #{permissionScope}, permissionDescription = #{permissionDescription} WHERE permissionId = #{permissionId}")
    int updatePermission(Permissions permission);

    @Delete("DELETE FROM permissions WHERE permissionId = #{permissionId}")
    int deletePermission(Long permissionId);

    @Select("SELECT * FROM permissions")
    List<Permissions> listAllPermissions();
}