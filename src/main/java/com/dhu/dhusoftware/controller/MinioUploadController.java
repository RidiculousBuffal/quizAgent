package com.dhu.dhusoftware.controller;

import cn.dev33.satoken.util.SaResult;
import com.dhu.dhusoftware.constant.COMMON;
import com.dhu.dhusoftware.service.MinioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin
public class MinioUploadController {
    @Autowired
    private MinioService minioService;

    @PostMapping("/upload")
    public SaResult uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            return SaResult.ok().setCode(COMMON.SUCCESS_CODE).setData(minioService.upload(file));
        } catch (Exception e) {
            return SaResult.error().setCode(COMMON.FAILURE_CODE).setData(e.getMessage());
        }
    }
}
