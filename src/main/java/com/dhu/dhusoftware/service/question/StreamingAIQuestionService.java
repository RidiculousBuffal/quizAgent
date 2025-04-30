package com.dhu.dhusoftware.service.question;

import com.dhu.dhusoftware.ai.prompt.AIQuestionPrompts;
import com.dhu.dhusoftware.ai.tools.AIQuestionTools;
import com.dhu.dhusoftware.mapper.AIGenerationHistoryMapper;
import com.dhu.dhusoftware.pojo.AIGenerationHistory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.ai.chat.messages.*;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.model.tool.ToolCallingChatOptions;
import org.springframework.ai.model.tool.ToolCallingManager;
import org.springframework.ai.model.tool.ToolExecutionResult;
import org.springframework.ai.tool.ToolCallback;
import org.springframework.ai.tool.ToolCallbacks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StreamingAIQuestionService {

    private final ChatModel chatModel;
    private final AIQuestionTools aiQuestionTools;
    private final AIGenerationHistoryMapper historyMapper;
    private final ToolCallingManager toolCallingManager;

    @Autowired
    public StreamingAIQuestionService(ChatModel chatModel,
                                      AIQuestionTools aiQuestionTools,
                                      AIGenerationHistoryMapper historyMapper,
                                      ToolCallingManager toolCallingManager) {
        this.chatModel = chatModel;
        this.aiQuestionTools = aiQuestionTools;
        this.historyMapper = historyMapper;
        this.toolCallingManager = toolCallingManager;
    }

    /**
     * 流式生成问卷问题，返回连续的文本片段（可以直接作为 SSE 数据）。
     */
    public Flux<String> streamQuestion(String userId,
                                       Long quizId,
                                       String question,
                                       String modelName) {

        // === 1. 构造上下文 & 入库初始历史 ===
        List<AIGenerationHistory> past = historyMapper.listByUserIdAndQuizId(userId, quizId);
        String context = buildContext(past);
        String userPrompt = context.isEmpty() ? question : context + "\nUser: " + question;

        AIGenerationHistory his = new AIGenerationHistory();
        his.setUserId(userId);
        his.setQuizId(quizId);
        his.setInputPrompt(userPrompt);
        his.setGenerationTime(Timestamp.valueOf(LocalDateTime.now()));
        his.setStatus(true);
        historyMapper.addAIGenerationHistory(his);

        // === 2. Prompt & ChatOptions ===
        List<Message> msgs = List.of(
                new SystemMessage(AIQuestionPrompts.QuestionSystemPrompt),
                new UserMessage(userPrompt)
        );

        ToolCallback[] tc = ToolCallbacks.from(aiQuestionTools);
        ToolCallingChatOptions opts = ToolCallingChatOptions.builder()
                .toolCallbacks(tc)
                .toolContext(Map.of("quizId", String.valueOf(quizId)))
                .internalToolExecutionEnabled(false)
                .model(modelName)
                .build();

        Prompt firstPrompt = new Prompt(msgs, opts);

        StringBuilder buffer = new StringBuilder();     // 用来收集所有输出

        Flux<String> stream = streamRound(firstPrompt, opts, 0, 10)
                // 1️⃣ 边流式发送，边把片段追加到 StringBuilder
                .doOnNext(buffer::append)
                // 2️⃣ 流正常结束或异常时，把最终结果写回数据库
                .doFinally(sig -> {
                    try {
                        String fullResponse = buffer.toString();
                        ObjectMapper mapper = new ObjectMapper();

                        // 分离工具调用和普通文本
                        List<Map<String, Object>> toolCalls = new ArrayList<>();
                        StringBuilder plainText = new StringBuilder();

                        // 按行处理以识别工具调用JSON
                        String[] lines = fullResponse.split("\n");
                        for (String line : lines) {
                            line = line.trim();
                            if (line.startsWith("{\"type\":\"toolCall\"") || line.startsWith("{\"tool\":")) {
                                try {
                                    // 解析工具调用JSON
                                    Map<String, Object> toolData = mapper.readValue(line, Map.class);
                                    toolCalls.add(toolData);
                                } catch (Exception e) {
                                    // 非JSON则作为普通文本
                                    if (!line.isEmpty()) {
                                        plainText.append(line).append("\n");
                                    }
                                }
                            } else if (!line.isEmpty()) {
                                // 普通文本行
                                plainText.append(line).append("\n");
                            }
                        }

                        // 创建结构化响应
                        Map<String, Object> structuredResponse = new HashMap<>();
                        structuredResponse.put("text", plainText.toString().trim());
                        structuredResponse.put("toolCalls", toolCalls);

                        his.setGeneratedResult(mapper.writeValueAsString(structuredResponse));
                    } catch (Exception e) {
                        // 解析失败时使用简单格式
                        his.setStatus(false);
                        his.setErrorMsg("Failed to parse response: " + e.getMessage());
                        try {
                            his.setGeneratedResult(new ObjectMapper().writeValueAsString(
                                    Map.of("aiResponse", buffer.toString())
                            ));
                        } catch (Exception ex) {
                            his.setErrorMsg(his.getErrorMsg() + "; " + ex.getMessage());
                        }
                    } finally {
                        historyMapper.updateAIGenerationHistory(his);
                    }
                });

        return stream;   // ❸ 把可以被 SSE/WebFlux 直接消费的流返回给控制器
    }

    /**
     * 单轮对话的流 &rarr; 发现工具调用则递归下一轮
     */
    private Flux<String> streamRound(Prompt prompt,
                                     ToolCallingChatOptions opts,
                                     int round,
                                     int maxRounds) {

        if (round >= maxRounds) {
            return Flux.just("\n[WARN] reach max rounds\n");
        }

        return chatModel.stream(prompt)
                // ① 过滤掉 result 为空的片段（控制帧 / keep-alive）
                .filter(resp -> resp.getResult() != null
                        && resp.getResult().getOutput() != null)
                .flatMap(resp -> {
                    var output = resp.getResult().getOutput();

                    /* ────────── A. 普通文本 ────────── */
                    if (!output.hasToolCalls()) {
                        String text = Optional.ofNullable(output.getText()).orElse("");
                        return Flux.just(text);
                    }

                    /* ────────── B. 触发工具调用 ────────── */
                    return Mono
                            .fromCallable(() ->
                                    toolCallingManager.executeToolCalls(prompt, resp))
                            .subscribeOn(Schedulers.boundedElastic())   // 工具可能阻塞
                            .flatMapMany(exec -> {
                                String toolStr = extractToolResult(exec);
                                Prompt next = new Prompt(exec.conversationHistory(), opts);
                                return Flux.concat(
                                        Flux.just(toolStr),
                                        streamRound(next, opts, round + 1, maxRounds)
                                );
                            });
                });
    }

    /**
     * 提取工具响应的可读字符串，可按需改成 JSON
     */
    private String extractToolResult(ToolExecutionResult exec) {
        List<Message> hist = exec.conversationHistory();
        if (hist.isEmpty()) return "";
        Message last = hist.get(hist.size() - 1);
        if (last instanceof ToolResponseMessage trm) {
            return trm.getResponses().stream()
                    .map(r -> {
                        try {
                            ObjectMapper mapper = new ObjectMapper();
                            ObjectNode toolNode = mapper.createObjectNode();

                            // 核心改变：创建结构化JSON
                            toolNode.put("type", "toolCall");
                            toolNode.put("tool", r.name());

                            // 解析并内嵌工具返回的JSON数据
                            String responseData = r.responseData().toString();
                            if (responseData.startsWith("问题已经插入到数据库,信息为:")) {
                                // 提取纯JSON部分
                                responseData = responseData.substring(responseData.indexOf("{"));
                            }

                            // 添加原始工具结果
                            toolNode.set("result", mapper.readTree(responseData));

                            return "\n" + mapper.writeValueAsString(toolNode) + "\n";
                        } catch (Exception e) {
                            // 如果解析失败，回退到原始格式
                            return "\n[ToolCall] " + r.name() + " &rarr; " + r.responseData() + "\n";
                        }
                    })
                    .reduce("", String::concat);
        }
        return "";
    }

    /**
     * 根据历史聊天构建上下文
     */
    private String buildContext(List<AIGenerationHistory> list) {
        return list.stream()
                .sorted(Comparator.comparing(AIGenerationHistory::getGenerationTime))
                .map(h -> {
                    String u = h.getInputPrompt() == null ? "" : "User: " + h.getInputPrompt();
                    String a = h.getGeneratedResult() == null ? "" : "AI: " + h.getGeneratedResult();
                    return u + "\n" + a;
                })
                .filter(s -> !s.isBlank())
                .collect(Collectors.joining("\n"));
    }
}