package com.dhu.dhusoftware.dto;

import lombok.Data;

/**
 * 用户数据传输对象
 */
@Data
public class UserDto {
    private String userId;
    private String userName;
    private String userEmail;
    private String userAvatar;
}