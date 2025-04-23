package com.dhu.dhusoftware.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "spring.ai.openai")
public class OpenAIProperties {
    private String baseUrl;
    private String apiKey;
}
