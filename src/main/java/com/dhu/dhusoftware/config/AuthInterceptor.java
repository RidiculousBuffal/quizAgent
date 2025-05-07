package com.dhu.dhusoftware.config;

import cn.dev33.satoken.apikey.SaApiKeyUtil;
import cn.dev33.satoken.apikey.model.ApiKeyModel;
import cn.dev33.satoken.exception.NotLoginException;
import cn.dev33.satoken.stp.StpUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;


@Component
public class AuthInterceptor implements HandlerInterceptor {

    // 默认 ApiKey 请求头名称（可以根据 Sa-Token 配置调整）
    private static final String API_KEY_HEADER_NAME = "apikey";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. 从请求头中获取 ApiKey
        String apiKey = request.getHeader(API_KEY_HEADER_NAME);
        // 2. 尝试校验 ApiKey
        boolean isApiKeyValid = false;
        if (apiKey != null && !apiKey.isEmpty()) {
            try {
                ApiKeyModel apiKeyModel = SaApiKeyUtil.checkApiKey(apiKey);
                if (apiKeyModel != null) {
                    isApiKeyValid = true;
                }
            } catch (Exception e) {
                // ApiKey 校验失败，不抛出异常，继续下一步校验
                isApiKeyValid = false;
            }
        }

        // 3. 如果 ApiKey 校验通过，直接放行
        if (isApiKeyValid) {
            return true;
        }

        // 4. 如果 ApiKey 校验未通过，尝试校验 Token
        try {
            StpUtil.checkLogin();
            return true; // Token 校验通过，放行
        } catch (NotLoginException e) {
            // Token 校验失败，返回未登录状态
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Authentication failed: Neither ApiKey nor Token is valid.");
            return false;
        }
    }
}