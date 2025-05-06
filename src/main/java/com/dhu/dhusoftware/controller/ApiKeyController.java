package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.apikey.model.ApiKeyModel;
import cn.dev33.satoken.stp.StpUtil;
import cn.dev33.satoken.util.SaResult;

import cn.dev33.satoken.apikey.SaApiKeyUtil;
import com.dhu.dhusoftware.constant.COMMON;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/apiKey")
public class ApiKeyController {

    /**
     * 创建新的API Key
     *
     * @param title       API Key的标题
     * @param intro       API Key的描述
     * @param expiresTime 过期时间（13位时间戳），-1表示永不过期
     * @return SaResult封装的结果，包含创建成功与否
     */
    @GetMapping("/create")
    public SaResult createApiKey(
            @RequestParam("title") String title,
            @RequestParam("intro") String intro,
            @RequestParam(value = "expiresTime", defaultValue = "-1") long expiresTime) {
        try {
            // 获取当前登录用户ID
            String userId = StpUtil.getLoginIdAsString();

            // 创建新的API Key Model
            ApiKeyModel akModel = SaApiKeyUtil.createApiKeyModel(userId)
                    .setTitle(title)
                    .setIntro(intro);

            // 设置过期时间
            if (expiresTime != -1) {
                akModel.setExpiresTime(expiresTime);
            }

            // 保存API Key
            SaApiKeyUtil.saveApiKey(akModel);

            return SaResult.ok("API Key创建成功").setCode(COMMON.SUCCESS_CODE).setData(akModel.getApiKey());
        } catch (Exception e) {
            return SaResult.error("API Key创建失败: " + e.getMessage()).setCode(COMMON.FAILURE_CODE);
        }
    }

    /**
     * 列出当前用户的API Key列表
     *
     * @return SaResult封装的结果，包含用户的API Key列表
     */
    @GetMapping("/list")
    public SaResult listApiKeyByUser() {
        try {
            // 获取当前登录用户ID
            String userId = StpUtil.getLoginIdAsString();

            // 获取用户的所有API Key列表
            List<ApiKeyModel> apiKeyList = SaApiKeyUtil.getApiKeyList(userId);

            return SaResult.ok("获取API Key列表成功").setData(apiKeyList).setCode(COMMON.SUCCESS_CODE);
        } catch (Exception e) {
            return SaResult.error("获取API Key列表失败: " + e.getMessage()).setCode(COMMON.FAILURE_CODE);
        }
    }

    @GetMapping("/delete")
    public SaResult deleteApiKey(@RequestParam("apiKey") String apiKey) {
        try {
            // 获取当前登录用户ID
            String userId = StpUtil.getLoginIdAsString();

            // 校验API Key是否属于当前用户
            Object loginId = SaApiKeyUtil.getLoginIdByApiKey(apiKey);
            if (loginId == null || !userId.equals(loginId.toString())) {
                return SaResult.error("无权限删除此API Key").setCode(COMMON.FAILURE_CODE);
            }

            // 删除API Key
            SaApiKeyUtil.deleteApiKey(apiKey);

            return SaResult.ok("API Key删除成功").setCode(COMMON.SUCCESS_CODE).setData(true);
        } catch (Exception e) {
            return SaResult.error("API Key删除失败: " + e.getMessage()).setCode(COMMON.FAILURE_CODE).setData(false);
        }
    }
}