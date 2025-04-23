package com.dhu.dhusoftware.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.Timestamp;

/**
 * AI问卷生成历史记录实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIGenerationHistory {
    private Long historyId; // 历史记录ID，自增主键
    private String userId; // 生成者用户ID，外键关联user表
    private Long quizId; // 关联的问卷ID（生成后保存为问卷），外键关联quiz表
    private String inputPrompt; // 用户输入的提示词（JSON格式）
    private String generatedResult; // AI生成的问卷内容（JSON格式）
    private Timestamp generationTime; // 生成时间，默认当前时间
    private Boolean status; // 状态：1成功，0失败
    private String errorMsg; // 生成失败时的错误信息
}