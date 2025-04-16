package com.dhu.dhusoftware.dto;

import lombok.Data;

/**
 * 用户角色关联数据传输对象
 */
@Data
public class UserRoleDto {
    private Long id;
    private String userId;
    private Long roleId;
}