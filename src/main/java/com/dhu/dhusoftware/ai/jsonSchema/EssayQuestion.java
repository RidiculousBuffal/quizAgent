package com.dhu.dhusoftware.ai.jsonSchema;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;

public record EssayQuestion(
        @JsonProperty(required = true, defaultValue = "标题") String title,
        @JsonProperty(required = true, defaultValue = "描述") String description,
        @JsonProperty(required = false, defaultValue = "true") Boolean isRequired,
        @JsonProperty(required = false, defaultValue = "true") Boolean isVisible,
        @JsonPropertyDescription("允许填入的最小长度")
        @JsonProperty(required = false, defaultValue = "0") Integer minLength,
        @JsonPropertyDescription("允许填入的最大长度")
        @JsonProperty(required = false, defaultValue = "1000") Integer maxLength,
        @JsonPropertyDescription("是否允许用户使用markdown编辑器")
        @JsonProperty(required = true, defaultValue = "true") Boolean allowMarkdown,
        @JsonPropertyDescription("是否隐藏字数统计")
        @JsonProperty(required = false, defaultValue = "false") Boolean hideWordCount,
        @JsonPropertyDescription("用户输入为空时的占位符")
        @JsonProperty(required = false, defaultValue = "请在此输入您的回答...") String placeholder
) {
}
