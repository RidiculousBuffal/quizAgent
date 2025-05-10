package com.dhu.dhusoftware.ai.jsonSchema;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;

import java.util.List;

public record FileQuestion(
        @JsonProperty(required = true, defaultValue = "标题") String title,
        @JsonProperty(required = true, defaultValue = "描述") String description,
        @JsonProperty(required = true, defaultValue = "true") Boolean isRequired,
        @JsonProperty(required = true, defaultValue = "true") Boolean isVisible,
        @JsonPropertyDescription("允许传入的最大文件数量")
        @JsonProperty(required = true, defaultValue = "1") Integer maxFiles,
        @JsonPropertyDescription("允许传入的最大文件大小(B)")
        @JsonProperty(required = true, defaultValue = "104857600") Integer maxFileSize,
        @JsonPropertyDescription("是否将文本文件转化为markdown格式")
        @JsonProperty(required = true, defaultValue = "false") Integer convertToMarkdown,
        @JsonPropertyDescription("允许传入的文件类型，如不填入则为无限制")
        @JsonProperty(required = false) List<String> allowFileTypes
) {
}
