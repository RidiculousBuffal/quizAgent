package com.dhu.dhusoftware.config;

import cn.dev33.satoken.context.SaHolder;
import cn.dev33.satoken.context.model.SaRequest;
import cn.dev33.satoken.fun.strategy.SaCorsHandleFunction;
import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.router.SaHttpMethod;
import cn.dev33.satoken.router.SaRouter;
import cn.dev33.satoken.stp.StpUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Bean
    public SaCorsHandleFunction corsHandle() {
        return (req, res, sto) -> {
            res.
                    // 允许指定域访问跨域资源
                     setHeader("Access-Control-Allow-Origin", "*")
                    // 允许所有请求方式
                    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
                    // 有效时间
                    .setHeader("Access-Control-Max-Age", "3600")
                    // 允许的header参数
                    .setHeader("Access-Control-Allow-Headers", "*");

            // 如果是预检请求，则立即返回到前端
            SaRouter.match(SaHttpMethod.OPTIONS)
                    .free(r -> System.out.println("--------OPTIONS预检请求，不做处理"))
                    .back();
        };
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 1. 放行所有 OPTIONS 预检请求
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
                if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
                    res.setStatus(HttpServletResponse.SC_OK);
                    return false;
                }
                return true;
            }
        }).addPathPatterns("/**").order(0);
        // 2. Sa-Token
        registry.addInterceptor(new SaInterceptor(handle -> {
                    SaRouter.match("/**")
                            .notMatch("/login")
                            .notMatch("/quizpermission/public/check/**")
                            .notMatch("/public/**")
                            .notMatch("/api/question/listQuestions")
                            .check(r -> StpUtil.checkLogin());
                }))
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/login",
                        "/public/**",
                        "/quizpermission/public/check/**",
                        "/api/question/listQuestions/**",
                        "/api/quiz/**",
                        "/upload"
                )
                .order(1);
    }

}