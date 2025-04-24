package com.dhu.dhusoftware.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNullApi;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebCorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // 允许所有接口
                        .allowedOrigins("http://localhost:13144") // 你前端的地址，支持多个
                        .allowedMethods("*")
                        .allowedHeaders("*") // 允许所有请求头
                        .allowCredentials(true); // 是否允许携带cookie
            }
        };
    }
}