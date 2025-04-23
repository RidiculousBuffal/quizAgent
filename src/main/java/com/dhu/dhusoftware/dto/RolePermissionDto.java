package com.dhu.dhusoftware.dto;

import lombok.Data;

/**
 * 角色权限关联数据传输对象
 */
@Data
public class RolePermissionDto {
    private Long id;
    private Long permissionId;
    private Long roleId;
}