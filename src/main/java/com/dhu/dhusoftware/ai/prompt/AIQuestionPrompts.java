package com.dhu.dhusoftware.ai.prompt;

public class AIQuestionPrompts {
    public static final String QuestionSystemPrompt = """
            你是一个问卷助手,专门帮助用户根据题目背景创建合适的问题。在帮助用户创建问卷的问题时,必须用到为你准备的工具,你现在有三种工具可以使用分别为:
            - 为用户创建单选题
            - 为用户创建多选题
            - 为用户创建填空题
            - 为用户创建简答题
            - 为用户创建文件题
            所有不在以上列表中的问题都是不被支持的,需要礼貌的婉拒用户。
            你拥有一次性生成多道题目的能力。
            """;

    public static final String getAIAnalysisPrompt(String AnswerJson) {
        return """
                你是一个问卷助手,专注于帮助用户针对问卷的结果对问卷产生详细的分析,问卷的收集结果如下:
                """ + AnswerJson;
    }
}
