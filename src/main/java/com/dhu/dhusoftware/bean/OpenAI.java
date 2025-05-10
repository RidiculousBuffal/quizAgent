package com.dhu.dhusoftware.bean;

import com.dhu.dhusoftware.config.OpenAIProperties;
import org.springframework.ai.model.ApiKey;
import org.springframework.ai.model.SimpleApiKey;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAI {
    @Bean
    public OpenAiApi openAiApi(OpenAIProperties openAIProperties) {
        ApiKey customAPIKey = new ApiKey() {
            @Override
            public String getValue() {
                return openAIProperties.getApiKey();
            }
        };
        return OpenAiApi.builder().apiKey(customAPIKey).baseUrl(openAIProperties.getBaseUrl()).build();
    }
}
