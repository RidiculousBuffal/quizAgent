package com.dhu.dhusoftware.ai.tools;

import com.dhu.dhusoftware.ai.jsonSchema.*;
import com.dhu.dhusoftware.service.question.*;

import org.springframework.ai.chat.model.ToolContext;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AIQuestionTools {
    @Autowired
    private FillBlankQuestionService fillBlankQuestionService;
    @Autowired
    private RadioQuestionService radioQuestionService;
    @Autowired
    private CheckboxQuestionService checkboxQuestionService;
    @Autowired
    private EssayQuestionService essayQuestionService;
    @Autowired
    private FileQuestionService fileQuestionService;

    @Tool(description = "生成填空题")
    public String createFillBlankQuestion(@ToolParam(description = "填空题元信息") FillBlankQuestion fillBlankPayLoad, ToolContext toolContext) throws Exception {
        // 从 toolContext 中提取 quizId（如果需要覆盖传入的 quizId）
        Object contextQuizIdObj = toolContext.getContext().get("quizId");
        Long contextQuizId = contextQuizIdObj != null ? Long.valueOf(contextQuizIdObj.toString()) : null;
        if (contextQuizId == null) {
            throw new IllegalArgumentException("quizId must be provided either as parameter or in context.");
        }
        return fillBlankQuestionService.processAndSaveFillBlankQuestion(fillBlankPayLoad, contextQuizId);
    }

    @Tool(description = "生成单选题")
    public String createRadioQuestion(@ToolParam(description = "单选题元信息") RadioQuestion radioQuestionPayLoad, ToolContext toolContext) throws Exception {
        // 从 toolContext 中提取 quizId（如果需要覆盖传入的 quizId）
        Object contextQuizIdObj = toolContext.getContext().get("quizId");
        Long contextQuizId = contextQuizIdObj != null ? Long.valueOf(contextQuizIdObj.toString()) : null;
        if (contextQuizId == null) {
            throw new IllegalArgumentException("quizId must be provided either as parameter or in context.");
        }
        return radioQuestionService.processAndSaveRadioQuestion(radioQuestionPayLoad, contextQuizId);
    }

    @Tool(description = "生成多选题")
    public String createCheckBoxQuestion(@ToolParam(description = "多选题元信息") CheckboxQuestion checkboxQuestionPayLoad, ToolContext toolContext) throws Exception {
        // 从 toolContext 中提取 quizId（如果需要覆盖传入的 quizId）
        Object contextQuizIdObj = toolContext.getContext().get("quizId");
        Long contextQuizId = contextQuizIdObj != null ? Long.valueOf(contextQuizIdObj.toString()) : null;
        if (contextQuizId == null) {
            throw new IllegalArgumentException("quizId must be provided either as parameter or in context.");
        }
        return checkboxQuestionService.processAndSaveCheckboxQuestion(checkboxQuestionPayLoad, contextQuizId);
    }

    @Tool(description = "生成简答题")
    public String createEssayQuestion(@ToolParam(description = "简答题题元信息")EssayQuestion essayQuestionPayload, ToolContext toolContext) throws Exception {
        Object contextQuizIdObj = toolContext.getContext().get("quizId");
        Long contextQuizId = contextQuizIdObj != null ? Long.valueOf(contextQuizIdObj.toString()) : null;
        if (contextQuizId == null) {
            throw new IllegalArgumentException("quizId must be provided either as parameter or in context.");
        }
        return essayQuestionService.processAndSaveEssayQuestion(essayQuestionPayload, contextQuizId);
    }

    @Tool(description = "生成文件题")
    public String createFileQuestion(@ToolParam(description = "文件题题元信息") FileQuestion fileQuestionPayload, ToolContext toolContext) throws Exception {
        Object contextQuizIdObj = toolContext.getContext().get("quizId");
        Long contextQuizId = contextQuizIdObj != null ? Long.valueOf(contextQuizIdObj.toString()) : null;
        if (contextQuizId == null) {
            throw new IllegalArgumentException("quizId must be provided either as parameter or in context.");
        }
        return fileQuestionService.processAndSaveFileQuestion(fileQuestionPayload, contextQuizId);
    }
}