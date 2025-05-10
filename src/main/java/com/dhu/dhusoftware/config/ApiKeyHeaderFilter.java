package com.dhu.dhusoftware.config;

import com.alibaba.ttl.TransmittableThreadLocal;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Enumeration;

@Component
public class ApiKeyHeaderFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(ApiKeyHeaderFilter.class);

    // 使用 TransmittableThreadLocal 替代 MDC
    private static final TransmittableThreadLocal<String> API_KEY_HOLDER = new TransmittableThreadLocal<>();

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("ApiKeyHeaderFilter initialized");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {
        if (servletRequest instanceof HttpServletRequest) {
            HttpServletRequest request = (HttpServletRequest) servletRequest;

            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                // 仅存储以 apikey 开头的请求头
                if (headerName.toLowerCase().startsWith("apikey")) {
                    String headerValue = request.getHeader(headerName);
                    API_KEY_HOLDER.set(headerValue); // 将 apikey 存入 TransmittableThreadLocal
                    logger.info("Captured header: {} = {}", headerName, headerValue);
                }
            }
        }

        try {
            // 继续处理请求
            chain.doFilter(servletRequest, servletResponse);
        } finally {
            // 请求处理完成后，清理 TransmittableThreadLocal
            API_KEY_HOLDER.remove();
            logger.debug("Cleared TransmittableThreadLocal headers for request");
        }
    }

    @Override
    public void destroy() {
        logger.info("ApiKeyHeaderFilter destroyed");
    }

    // 提供一个静态方法供其他地方获取 apikey 值
    public static String getApiKey() {
        return API_KEY_HOLDER.get();
    }
}