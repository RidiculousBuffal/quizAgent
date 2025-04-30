package com.dhu.dhusoftware.ai.tools;

import com.dhu.dhusoftware.ai.jsonSchema.CheckboxQuestion;
import com.dhu.dhusoftware.ai.jsonSchema.FillBlank;
import com.dhu.dhusoftware.ai.jsonSchema.RadioQuestion;
import com.dhu.dhusoftware.service.question.CheckboxQuestionService;
import com.dhu.dhusoftware.service.question.FillBlankQuestionService;
import com.dhu.dhusoftware.service.question.RadioQuestionService;

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

    @Tool(description = "生成填空题")
    public String createFillBlankQuestion(@ToolParam(description = "填空题元信息") FillBlank fillBlankPayLoad, ToolContext toolContext) throws Exception {
        // 从 toolContext 中提取 quizId（如果需要覆盖传入的 quizId）
        Object contextQuizIdObj = toolContext.getContext().get("quizId");
        Long contextQuizId = contextQuizIdObj != null ? Long.valueOf(contextQuizIdObj.toString()) : null;
        if (contextQuizId == null) {
            throw new IllegalArgumentException("quizId must be provided either as parameter or in context.");
        }
        return fillBlankQuestionService.processAndSaveFillBlank(fillBlankPayLoad, contextQuizId);
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
}