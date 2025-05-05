package com.dhu.dhusoftware.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix="logto")
@Data
public class LogtoConfig {
    private String jwksUri;   // JWKS URI
    private String issuer;    // Issuer
    private String appId;     // APP ID
    private String frontendUrl;
}
