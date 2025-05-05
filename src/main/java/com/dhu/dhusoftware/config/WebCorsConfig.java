package com.dhu.dhusoftware.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableConfigurationProperties(LogtoConfig.class)
public class WebCorsConfig implements WebMvcConfigurer {
    @Autowired
    private LogtoConfig logtoConfig;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(this.logtoConfig.getFrontendUrl())
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}