package com.dhu.dhusoftware.service;
import cn.dev33.satoken.stp.StpUtil;
import com.dhu.dhusoftware.constant.QuizConstants;
import com.dhu.dhusoftware.constant.QuizPermissionTypeConstants;
import com.dhu.dhusoftware.dto.QuizPermissionDto;
import com.dhu.dhusoftware.mapper.QuizMapper;
import com.dhu.dhusoftware.mapper.QuizPermissionMapper;
import com.dhu.dhusoftware.mapper.QuizPermissionTypeMapper;
import com.dhu.dhusoftware.pojo.Quizpermission;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class QuizPermissionService {

    @Autowired
    private QuizPermissionMapper quizPermissionMapper;

    @Autowired
    private QuizPermissionTypeMapper quizPermissionTypeMapper;

    @Autowired
    private QuizMapper quizMapper;

    /**
     * 通过问卷ID获取permission的所有所有内容
     *
     * @param quizId 问卷ID
     * @return QuizPermissionDto
     */
    public Quizpermission getPermissionByQuizId(Long quizId) {
        Quizpermission quizpermission = quizPermissionMapper.getQuizPermissionByQuizId(quizId);
        if (quizpermission == null) {
            throw new IllegalArgumentException(QuizConstants.NOT_FOUND);
        }

        return quizpermission;
    }

    /**
     * 通过问卷ID获取当前用户是否有权访问
     *
     * @param quizId 问卷ID
     * @return boolean
     */
    public boolean hasPermission(Long quizId) {
        Quizpermission quizpermission = quizPermissionMapper.getQuizPermissionByQuizId(quizId);
        if (quizpermission == null) {
            throw new IllegalArgumentException(QuizConstants.NOT_FOUND);
        }
        String currentUserId = StpUtil.getLoginIdAsString();
        String detailStr = quizpermission.getDetails();
        if (quizpermission.getQuizPermissionTypeId() ==
                quizPermissionTypeMapper.getQuizPermissionIdByType(QuizPermissionTypeConstants.PUBLIC)) {
            return true;
        }
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode detailJson = objectMapper.readTree(detailStr);

            boolean needLogin = detailJson.get("needLogin").asBoolean();
            if (!needLogin) {
                return true;
            }
            // allowUsers和denyUsers设置为数组节点，如果不存在则为空
            JsonNode allowUsersNode = detailJson.get("allowUsers");
            JsonNode denyUsersNode = detailJson.get("denyUsers");
            boolean hasAllow = allowUsersNode != null && !allowUsersNode.isEmpty();
            boolean hasDeny = denyUsersNode != null && !denyUsersNode.isEmpty();
            // allowUsers和denyUsers不能同时为空
            if (!hasAllow && !hasDeny) {
                throw new IllegalArgumentException("allowUsers和denyUsers不能同时为空");
            }
            if (hasAllow && hasDeny) {
                throw new IllegalArgumentException("allowUsers和denyUsers不能同时都不为空");
            }
            // 只校验不为空的那个
            if (hasAllow) {
                // allowUsers不为空，只允许在列表中的用户
                for (JsonNode node : allowUsersNode) {
                    if (currentUserId.equals(node.asText())) {
                        return true;
                    }
                }
                return false;
            } else {
                // denyUsers不为空，denyUsers中的用户禁止，其余允许
                for (JsonNode node : denyUsersNode) {
                    if (currentUserId.equals(node.asText())) {
                        return false;
                    }
                }
                return true;
            }
        } catch (Exception e) {
            throw new RuntimeException("Permission detail解析失败", e);
        }
    }

    /**
     * 更新/创建quizPermission记录
     *
     * @param quizPermissionDto 问卷权限
     * @return QuizPermissionDto
     */
    public QuizPermissionDto updateOrInsertQuizPermission(QuizPermissionDto quizPermissionDto) {
        Quizpermission quizpermission = new Quizpermission();
        BeanUtils.copyProperties(quizPermissionDto, quizpermission);
        if (quizPermissionDto.getId() == null || quizPermissionDto.getId() <= 0) {
            quizPermissionMapper.addQuizPermission(quizpermission);
        } else {
            String quizCreatorId = quizMapper.getCreatorFromQuizPermissionByQuizId(quizpermission);
            String curUserId = StpUtil.getLoginIdAsString();
            // 这里对操作者和quiz的创建者进行验证
            if (Objects.equals(quizCreatorId, curUserId)) {
                quizPermissionMapper.updateQuizPermission(quizpermission);
            } else {
                throw new SecurityException(QuizConstants.PERMISSION_DENIED_MSG);
            }
        }
        BeanUtils.copyProperties(quizpermission, quizPermissionDto);
        return quizPermissionDto;
    }

    public boolean deleteQuizPermission(Long quizId) {
        Quizpermission quizpermission = new Quizpermission();
        quizpermission.setQuizId(quizId);
        String quizCreatorId = quizMapper.getCreatorFromQuizPermissionByQuizId(quizpermission);
        String curUserId = StpUtil.getLoginIdAsString();
        // 这里对操作者和quiz的创建者进行验证
        if (Objects.equals(quizCreatorId, curUserId)) {
            return quizPermissionMapper.deleteQuizPermission(quizId) > 0;
        } else {
            throw new SecurityException(QuizConstants.PERMISSION_DENIED_MSG);
        }
    }
}
