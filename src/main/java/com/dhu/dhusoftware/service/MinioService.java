package com.dhu.dhusoftware.service;

import com.dhu.dhusoftware.config.MinioConfig;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;
    private final MinioConfig minioConfig;

    // 上传文件并返回访问URL
    public String upload(MultipartFile file) throws Exception {
        // 生成 UUID 文件名并保留后缀
        String originalFilename = file.getOriginalFilename();
        String ext = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uuidFileName = UUID.randomUUID().toString().replace("-", "") + ext;

        // 上传
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(minioConfig.getBucketName())
                        .object(uuidFileName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );

        // 构建文件URL（外链）
        return minioConfig.getEndpoint() + "/" + minioConfig.getBucketName() + "/" + uuidFileName;
    }
}