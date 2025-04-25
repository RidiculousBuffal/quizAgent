package com.dhu.dhusoftware.ai.jsonSchema;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;

import java.time.Year;
import java.util.List;

public record FillBlank(
        @JsonProperty(required = true, defaultValue = "标题") String title,
        @JsonProperty(required = true, defaultValue = "自定义描述") String description,
        @JsonProperty(required = false, defaultValue = "true") Boolean required,
        @JsonPropertyDescription("一共有几个空")
        @JsonProperty(required = true, defaultValue = "1") Integer blankCount,
        @JsonPropertyDescription("各个空的标签")
        @JsonProperty(required = false) List<String> blankLabels,
        @JsonProperty(required = false) AnswerType answerType,
        @JsonPropertyDescription("预设的正确答案")
        @JsonProperty(required = false) List<List<String>> correctAnswers,
        @JsonProperty(required = false, defaultValue = "填空") String placeholder,
        @JsonPropertyDescription("判断是否采用内联填空模式")
        @JsonProperty(required = false, defaultValue = "false") Boolean inlineMode,
        @JsonPropertyDescription("用{{blank}}代表空格,如:{{blank}}先生于{{blank}}年在{{blank}}宣布成立{{blank}},不论inlineMode是否开启都必须填写")
        @JsonProperty(required = true) String inlineText
) {
}


