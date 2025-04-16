package com.dhu.dhusoftware.constant;

/**
 * 问卷相关常量类
 */
public class QuizConstants {
    // 问卷状态
    public static final int STATUS_DRAFT = 0; // 草稿
    public static final int STATUS_PUBLISHED = 1; // 已发布



    // 成功消息
    public static final String SUCCESS_MSG = "操作成功";
    public static final String CREATE_SUCCESS = "创建成功";
    public static final String UPDATE_SUCCESS = "更新成功";
    public static final String DELETE_SUCCESS = "删除成功";

    // 错误消息
    public static final String FAILURE_MSG = "操作失败";
    public static final String NOT_FOUND = "资源未找到";
    public static final String PERMISSION_DENIED_MSG = "无权限操作";
    public static final String VALIDATION_ERROR_MSG = "参数错误";
}