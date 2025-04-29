package com.dhu.dhusoftware.config;

import cn.dev33.satoken.context.SaHolder;
import cn.dev33.satoken.context.model.SaRequest;
import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.router.SaRouter;
import cn.dev33.satoken.stp.StpUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handle -> {
                    // 拿到当前请求的 SaRequest
                    SaRequest request = SaHolder.getRequest();
                    // 跳过预检
                    if (HttpMethod.OPTIONS.matches(request.getMethod())) {
                        return;
                    }
                    // 其余请求做登录校验
                    SaRouter.match("/**")
                            .notMatch("/login")
                            .notMatch("/public/**")
                            .check(r -> StpUtil.checkLogin());
                }))
                .addPathPatterns("/**")
                .order(1);
    }
}