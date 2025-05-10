package com.dhu.dhusoftware.service.mcp;

import cn.dev33.satoken.apikey.SaApiKeyUtil;
import com.dhu.dhusoftware.ai.jsonSchema.*;
import com.dhu.dhusoftware.config.ApiKeyHeaderFilter;
import com.dhu.dhusoftware.dto.QuizDto;
import com.dhu.dhusoftware.mapper.UserMapper;
import com.dhu.dhusoftware.pojo.User;
import com.dhu.dhusoftware.service.QuizService;
import com.dhu.dhusoftware.service.question.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class McpService {
    @Autowired
    private UserMapper userMapper;
    private static final Logger logger = LoggerFactory.getLogger(McpService.class);

    @Autowired
    private QuizService quizService;
    @Autowired
    private CheckboxQuestionService checkboxQuestionService;
    @Autowired
    private EssayQuestionService essayQuestionService;
    @Autowired
    private FileQuestionService fileQuestionService;
    @Autowired
    private FillBlankQuestionService fillBlankQuestionService;
    @Autowired
    private RadioQuestionService radioQuestionService;

    @Tool(description = "获取当前的时间")
    public String getCurrentTime(String timezone) {
        try {
            String apikey = ApiKeyHeaderFilter.getApiKey();
            logger.info(apikey);
            // 如果未提供时区，默认使用 UTC
            ZoneId zoneId = timezone != null && !timezone.isEmpty() ? ZoneId.of(timezone) : ZoneId.of("UTC");
            ZonedDateTime currentTime = ZonedDateTime.now(zoneId);

            // 格式化时间
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z");
            String formattedTime = currentTime.format(formatter);

            // 构建返回结果
            Map<String, Object> result = new HashMap<>();
            result.put("status", "success");
            result.put("timezone", timezone != null && !timezone.isEmpty() ? timezone : "UTC");
            result.put("current_time", formattedTime);
            result.put("timestamp", currentTime.toEpochSecond());

            // 使用 ObjectMapper 将 Map 转换为 JSON 字符串
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(result);
        } catch (Exception e) {
            // 处理时区无效的情况
            try {
                ZonedDateTime currentTimeUtc = ZonedDateTime.now(ZoneId.of("UTC"));
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z");
                String formattedTimeUtc = currentTimeUtc.format(formatter);

                Map<String, Object> errorResult = new HashMap<>();
                errorResult.put("status", "error");
                errorResult.put("error", "Unknown timezone: " + (timezone != null ? timezone : "null"));
                errorResult.put("timezone", "UTC");
                errorResult.put("current_time", formattedTimeUtc);
                errorResult.put("timestamp", currentTimeUtc.toEpochSecond());

                ObjectMapper mapper = new ObjectMapper();
                return mapper.writeValueAsString(errorResult);
            } catch (Exception ex) {
                throw new RuntimeException("Failed to process time request", ex);
            }
        }
    }

    private String convertJsonToString(Object o) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(o);
        } catch (JsonProcessingException e) {
            return "解析失败";
        }
    }

    @Tool(description = "获取用户的个人信息")
    public String getUserInfo() {
        String apikey = ApiKeyHeaderFilter.getApiKey();
        String userId = (String) SaApiKeyUtil.getLoginIdByApiKey(apikey);
        User userById = userMapper.getUserById(userId);
        return this.convertJsonToString(userById);
    }

    @Tool(description = "创建或更新一份问卷")
    public String saveOrUpdateOneQuiz(@JsonPropertyDescription("问卷名字") @JsonProperty(required = true) String quizName, @JsonProperty(required = false) @JsonPropertyDescription("问卷描述") String quizDescription

    ) {
        QuizDto quizDto = new QuizDto();
        quizDto.setQuizName(quizName);
        quizDto.setQuizDescription(quizDescription);
        // 获取当前时间
        LocalDateTime now = LocalDateTime.now(ZoneId.of("GMT+8"));
        Timestamp quizStartTime = Timestamp.valueOf(now);
        // 获取一个月后的时间
        LocalDateTime oneMonthLater = now.plusMonths(1);
        Timestamp quizEndTime = Timestamp.valueOf(oneMonthLater);
        quizDto.setQuizStartTime(quizStartTime);
        quizDto.setQuizEndTime(quizEndTime);
        String apikey = ApiKeyHeaderFilter.getApiKey();
        String userId = (String) SaApiKeyUtil.getLoginIdByApiKey(apikey);
        quizDto.setCreator(userId);
        String prefix = "问卷创建成功,设置为暂未发布状态";
        return prefix + this.convertJsonToString(quizService.saveOrUpdateQuiz(quizDto, userId));
    }

    @Tool(description = "往已知的问卷中插入一道多选题")
    public String insertOneCheckboxQuestion(CheckboxQuestion checkboxQuestion, Long quizId) {
        try {
            return "创建成功" + checkboxQuestionService.processAndSaveCheckboxQuestion(checkboxQuestion, quizId);
        } catch (Exception e) {
            return "创建失败" + e.getMessage();
        }
    }

    @Tool(description = "往已知的问卷中插入一道单选题")
    public String insertOneRadioQuestion(RadioQuestion radioQuestion, Long quizId) {
        try {
            return "创建成功" + radioQuestionService.processAndSaveRadioQuestion(radioQuestion, quizId);
        } catch (Exception e) {
            return "创建失败" + e.getMessage();
        }
    }

    @Tool(description = "往已知的问卷中插入一道填空题")
    public String insertOneFillBlankQuestion(FillBlankQuestion fillBlankQuestion, Long quizId) {
        try {
            return "创建成功" + fillBlankQuestionService.processAndSaveFillBlankQuestion(fillBlankQuestion, quizId);
        } catch (Exception e) {
            return "创建失败" + e.getMessage();
        }
    }

    @Tool(description = "往已知的问卷中插入一道简答题")
    public String insertOneEssayQuestion(EssayQuestion essayQuestion, Long quizId) {
        try {
            return "创建成功" + essayQuestionService.processAndSaveEssayQuestion(essayQuestion, quizId);
        } catch (Exception e) {
            return "创建失败" + e.getMessage();
        }
    }

    @Tool(description = "往已知的问卷中插入一道文件题")
    public String insertOneFileQuestion(FileQuestion fileQuestion, Long quizId) {
        try {
            return "创建成功" + fileQuestionService.processAndSaveFileQuestion(fileQuestion, quizId);
        } catch (Exception e) {
            return "创建失败" + e.getMessage();
        }
    }


}