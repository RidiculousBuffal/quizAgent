package com.dhu.dhusoftware.bean;

import com.dhu.dhusoftware.config.OpenAIProperties;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAI {
    @Bean
    public OpenAiApi openAiApi(OpenAIProperties openAIProperties) {
        return new OpenAiApi(openAIProperties.getBaseUrl(), openAIProperties.getApiKey());
    }
}
