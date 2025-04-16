package com.dhu.dhusoftware.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.Timestamp;

/**
 * 问卷分发记录实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizDistribution {
    private Long distributionId; // 分发ID，自增主键
    private Long quizId; // 问卷ID，外键关联quiz表
    private String distributionType; // 分发类型：链接、邮件、系统通知等
    private String distributionTarget; // 分发目标：JSON格式，如用户ID列表或邮件地址
    private Timestamp distributionTime; // 分发时间，默认当前时间
    private Boolean status; // 状态：1已分发，0失效
    private String creator; // 分发者，外键关联user表
}