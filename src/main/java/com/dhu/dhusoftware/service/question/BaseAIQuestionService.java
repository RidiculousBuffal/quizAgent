package com.dhu.dhusoftware.service.question;

import com.dhu.dhusoftware.mapper.AIGenerationHistoryMapper;
import com.dhu.dhusoftware.pojo.AIGenerationHistory;
import com.dhu.dhusoftware.ai.prompt.AIQuestionPrompts;
import com.dhu.dhusoftware.ai.tools.AIQuestionTools;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.ToolResponseMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.model.tool.ToolCallingChatOptions;
import org.springframework.ai.model.tool.ToolExecutionResult;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.ToolCallbacks;
import org.springframework.ai.model.tool.ToolCallingManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BaseAIQuestionService {

    private final ChatModel chatModel;
    private final AIQuestionTools aiQuestionTools;
    private final AIGenerationHistoryMapper aiGenerationHistoryMapper;
    private final ToolCallingManager toolCallingManager;

    @Autowired
    public BaseAIQuestionService(ChatModel chatModel, AIQuestionTools aiQuestionTools,
                                 AIGenerationHistoryMapper aiGenerationHistoryMapper,
                                 ToolCallingManager toolCallingManager) {
        this.chatModel = chatModel;
        this.aiQuestionTools = aiQuestionTools;
        this.aiGenerationHistoryMapper = aiGenerationHistoryMapper;
        this.toolCallingManager = toolCallingManager;
    }

    /**
     * 生成问卷问题，并记录交互历史，支持多轮工具调用
     *
     * @param userId    用户ID
     * @param quizId    问卷ID
     * @param question  用户提出的问题或提示
     * @param modelName 用户指定的模型名称
     * @return Map 包含AI响应和工具调用的JSON元信息
     */
    public Map<String, Object> generateQuestion(String userId, Long quizId, String question, String modelName) throws JsonProcessingException {
        // 步骤1：获取与当前用户和quizId相关的历史聊天记录作为上下文
        List<AIGenerationHistory> historyList = aiGenerationHistoryMapper.listByUserIdAndQuizId(userId, quizId);
        String context = buildContext(historyList);

        // 步骤2：构建初始提示词，包含系统提示词、上下文和当前问题
        String userPromptContent = context.isEmpty() ? question : context + "\nUser: " + question;
        List<Message> messages = new ArrayList<>();
        messages.add(new SystemMessage(AIQuestionPrompts.QuestionSystemPrompt));
        messages.add(new UserMessage(userPromptContent));

        // 步骤3：记录用户输入到历史记录
        AIGenerationHistory history = new AIGenerationHistory();
        history.setUserId(userId);
        history.setQuizId(quizId);
        history.setInputPrompt(userPromptContent);
        history.setGenerationTime(Timestamp.valueOf(LocalDateTime.now()));
        history.setStatus(true); // 初始状态为成功
        history.setErrorMsg("");
        aiGenerationHistoryMapper.addAIGenerationHistory(history);

        // 步骤4：初始化工具调用选项，禁用框架自动工具执行，手动控制多轮调用，并设置模型名称
        ToolCallback[] questionTools = ToolCallbacks.from(aiQuestionTools);
        ToolCallingChatOptions chatOptions = ToolCallingChatOptions.builder()
                .toolCallbacks(questionTools)
                .toolContext(Map.of("quizId", String.valueOf(quizId)))
                .internalToolExecutionEnabled(false) // 禁用框架自动工具执行
                .model(modelName)// 设置用户指定的模型名称
                .build();

        // 步骤5：多轮递归调用AI模型和工具
        Map<String, Object> finalResult = performMultiTurnToolCalling(messages, chatOptions, history);

        // 步骤6：更新历史记录，保存最终结果
        ObjectMapper objectMapper = new ObjectMapper();
        String finalJsonString = objectMapper.writeValueAsString(finalResult);
        history.setGeneratedResult(finalJsonString);
        aiGenerationHistoryMapper.updateAIGenerationHistory(history);

        return finalResult;
    }

    /**
     * 执行多轮工具调用，直到没有新的工具调用请求
     *
     * @param initialMessages 初始消息列表，包含系统提示词和用户提示
     * @param chatOptions     工具调用选项
     * @param history         历史记录对象，用于更新错误信息
     * @return Map 包含最终AI响应和工具调用结果
     */
    private Map<String, Object> performMultiTurnToolCalling(List<Message> initialMessages, ToolCallingChatOptions chatOptions, AIGenerationHistory history) {
        Prompt currentPrompt = new Prompt(initialMessages, chatOptions);
        Map<String, Object> result = new HashMap<>();
        StringBuilder aiResponses = new StringBuilder();
        StringBuilder toolCallResults = new StringBuilder();

        int maxRounds = 10; // 最大轮数，防止无限循环
        int round = 0;

        while (round++ < maxRounds) {
            try {
                // 调用AI模型
                ChatResponse chatResponse = chatModel.call(currentPrompt);
                String aiOutput = chatResponse.getResult().getOutput().getText();
                aiResponses.append(aiOutput).append("\n");
                // 检查是否有工具调用请求
                if (!chatResponse.hasToolCalls()) {
                    // 没有工具调用，直接返回最终结果
                    result.put("aiResponse", aiResponses.toString());
                    if (!toolCallResults.toString().isEmpty()) {
                        result.put("toolCallJson", toolCallResults);
                    }
                    return result;
                }

                // 执行工具调用
                ToolExecutionResult toolExecutionResult = toolCallingManager.executeToolCalls(currentPrompt, chatResponse);

                // 从 conversationHistory 中提取工具调用结果
                List<Message> conversationHistory = toolExecutionResult.conversationHistory();
                if (!conversationHistory.isEmpty()) {
                    Message lastMessage = conversationHistory.getLast();
                    if (lastMessage instanceof ToolResponseMessage toolResponseMessage) {
                        toolResponseMessage.getResponses().forEach(response -> toolCallResults.append("Tool: ").append(response.name())
                                .append(", ID: ").append(response.id())
                                .append(", Result: ").append(response.responseData())
                                .append("\n"));
                    }
                }

                // 使用工具调用结果和历史对话更新提示词，继续下一轮
                currentPrompt = new Prompt(toolExecutionResult.conversationHistory(), chatOptions);
            } catch (Exception e) {
                // 如果调用失败，更新历史记录
                history.setStatus(false);
                history.setErrorMsg(e.getMessage());
                aiGenerationHistoryMapper.updateAIGenerationHistory(history);
                throw new RuntimeException("AI或工具调用失败: " + e.getMessage(), e);
            }
        }

        // 超出最大轮数，返回当前结果
        result.put("aiResponse", aiResponses + "\nWarning: Maximum rounds reached.");
        if (!toolCallResults.toString().isEmpty()) {
            result.put("toolCallJson", toolCallResults.toString());
        }
        return result;
    }

    /**
     * 构建上下文，基于历史记录
     *
     * @param historyList 历史记录列表
     * @return 上下文字符串
     */
    private String buildContext(List<AIGenerationHistory> historyList) {
        // 按时间升序排列历史记录，构建上下文
        return historyList.stream()
                .sorted(Comparator.comparing(AIGenerationHistory::getGenerationTime))
                .map(h -> {
                    String userInput = h.getInputPrompt() != null ? "User: " + h.getInputPrompt() : "";
                    String aiOutput = h.getGeneratedResult() != null ? "AI: " + h.getGeneratedResult() : "";
                    return userInput + "\n" + aiOutput;
                })
                .filter(s -> !s.isEmpty())
                .collect(Collectors.joining("\n"));
    }
}