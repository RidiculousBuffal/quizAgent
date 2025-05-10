package com.dhu.dhusoftware.service.mcp;

import cn.dev33.satoken.apikey.SaApiKeyUtil;
import com.dhu.dhusoftware.config.ApiKeyHeaderFilter;
import com.dhu.dhusoftware.mapper.UserMapper;
import com.dhu.dhusoftware.pojo.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class McpService {
    @Autowired
    private UserMapper userMapper;
    private static final Logger logger = LoggerFactory.getLogger(McpService.class);

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
        logger.info(apikey);
        String userId = (String) SaApiKeyUtil.getLoginIdByApiKey(apikey);
        User userById = userMapper.getUserById(userId);
        return this.convertJsonToString(userById);
    }
}