package com.dhu.dhusoftware.ai.jsonSchema;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;

import java.util.List;

public record RadioQuestion(
        @JsonProperty(required = true, defaultValue = "标题") String title,
        @JsonProperty(required = true, defaultValue = "描述") String description,
        @JsonProperty(required = false, defaultValue = "true") Boolean isRequired,
        @JsonProperty(required = false, defaultValue = "true") Boolean isVisible,
        @JsonPropertyDescription("选项列表")
        @JsonProperty(required = true) List<Option> options,
        @JsonPropertyDescription("是否允许其他选项")
        @JsonProperty(required = false, defaultValue = "false") Boolean allowOther,
        @JsonPropertyDescription("其他选项的提示文本")
        @JsonProperty(required = false, defaultValue = "其他，请注明：") String otherText
) {
    // 内部类表示选项
    public record Option(
            @JsonPropertyDescription("必须是uuid_v4格式")
            @JsonProperty(required = true) String id,
            @JsonProperty(required = true) String text,
            @JsonPropertyDescription("必须是uuid_v4格式")
            @JsonProperty(required = true) String value
    ) {
    }
}