package com.dhu.dhusoftware.ai.jsonSchema;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;

import java.util.List;

public record FillBlankQuestion(
        @JsonProperty(required = true, defaultValue = "标题") String title,
        @JsonProperty(required = true, defaultValue = "自定义描述") String description,
        @JsonProperty(required = false, defaultValue = "true") Boolean isRequired,
        @JsonPropertyDescription("一共有几个空,如不开启inline mode则要填写")
        @JsonProperty(required = true, defaultValue = "1") Integer blankCount,
        @JsonPropertyDescription("各个空的标签,如不开启inline mode则要填写")
        @JsonProperty(required = false) List<String> blankLabels,
        @JsonProperty(required = false) AnswerType answerType,
        @JsonPropertyDescription("预设的正确答案")
        @JsonProperty(required = false) List<List<String>> correctAnswers,
        @JsonProperty(required = false, defaultValue = "填空") String placeholder,
        @JsonPropertyDescription("判断是否采用内联填空模式")
        @JsonProperty(required = false, defaultValue = "false") Boolean inlineMode,
        @JsonPropertyDescription("用{{blank}}代表空格,如:{{blank}}先生于{{blank}}年在{{blank}}宣布成立{{blank}},仅开启inlineMode填写")
        @JsonProperty(required = false) String inlineText
) {
}


