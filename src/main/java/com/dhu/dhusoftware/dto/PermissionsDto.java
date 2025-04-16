package com.dhu.dhusoftware.dto;

import lombok.Data;

/**
 * 权限数据传输对象
 */
@Data
public class PermissionsDto {
    private Long permissionId;
    private String permissionScope;
    private String permissionDescription;
}