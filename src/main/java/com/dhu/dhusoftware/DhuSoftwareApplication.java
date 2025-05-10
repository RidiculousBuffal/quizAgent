package com.dhu.dhusoftware;

import com.dhu.dhusoftware.service.mcp.McpService;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DhuSoftwareApplication {

    public static void main(String[] args) {
        SpringApplication.run(DhuSoftwareApplication.class, args);
    }

    @Bean
    public ToolCallbackProvider futureQuizTools(McpService mcpService) {
        return MethodToolCallbackProvider.builder().toolObjects(mcpService).build();
    }
}
