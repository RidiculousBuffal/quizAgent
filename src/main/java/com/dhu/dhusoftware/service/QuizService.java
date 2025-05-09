package com.dhu.dhusoftware.service;

import com.dhu.dhusoftware.constant.PermissionConstants;
import com.dhu.dhusoftware.constant.QuizPermissionTypeConstants;
import com.dhu.dhusoftware.dto.QuizDisplayDTO;
import com.dhu.dhusoftware.dto.QuizDto;
import com.dhu.dhusoftware.dto.QuizPermissionDto;
import com.dhu.dhusoftware.dto.QuizQuestionDto;
import com.dhu.dhusoftware.mapper.QuizMapper;
import com.dhu.dhusoftware.mapper.QuizPermissionTypeMapper;
import com.dhu.dhusoftware.mapper.QuizQuestionAnswerMapper;
import com.dhu.dhusoftware.mapper.QuizQuestionMapper;
import com.dhu.dhusoftware.pojo.Quiz;
import com.dhu.dhusoftware.pojo.Quizquestion;
import com.dhu.dhusoftware.constant.QuizConstants;
import cn.dev33.satoken.stp.StpUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 问卷服务层，处理问卷创建、更新等逻辑
 */
@Slf4j
@Service
public class QuizService {

    @Autowired
    private QuizMapper quizMapper;

    @Autowired
    private QuizQuestionMapper quizQuestionMapper;

    @Autowired
    private QuizPermissionService quizPermissionService;

    @Autowired
    private QuizPermissionTypeMapper quizPermissionTypeMapper;


    /**
     * 创建或更新问卷
     *
     * @param quizDto 问卷数据传输对象
     * @return QuizDto 更新后的问卷数据
     */
    @Transactional(rollbackFor = Exception.class)
    public QuizDto saveOrUpdateQuiz(QuizDto quizDto,String currentUserId) {
        Quiz quiz = new Quiz();
        BeanUtils.copyProperties(quizDto, quiz);

        if (quiz.getQuizId() == null || quiz.getQuizId() <= 0) {
            // 新建问卷
            quiz.setCreator(currentUserId);
            quiz.setStatus(QuizConstants.STATUS_DRAFT); // 默认草稿状态
            quizMapper.addQuiz(quiz);
            QuizPermissionDto quizPermissionDto = new QuizPermissionDto();
            quizPermissionDto.setQuizId(quiz.getQuizId());
            quizPermissionDto.setQuizPermissionTypeId(quizPermissionTypeMapper.getQuizPermissionIdByType(QuizPermissionTypeConstants.PUBLIC));
            quizPermissionService.updateOrInsertQuizPermission(quizPermissionDto);
        } else {
            // 更新问卷，校验权限
            Quiz existingQuiz = quizMapper.getQuizById(quiz.getQuizId());
            if (existingQuiz == null) {
                throw new IllegalArgumentException(QuizConstants.NOT_FOUND);
            }
            if (!existingQuiz.getCreator().equals(currentUserId) && !StpUtil.hasPermission(PermissionConstants.SCOPE_QUIZ_UPDATE)) {
                throw new SecurityException(QuizConstants.PERMISSION_DENIED_MSG);
            }
            quizMapper.updateQuiz(quiz);
        }

        QuizDto resultDto = new QuizDto();
        BeanUtils.copyProperties(quiz, resultDto);
        return resultDto;
    }

    /**
     * 删除问卷
     *
     * @param quizId 问卷ID
     * @return 是否成功
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteQuiz(Long quizId) {
        String currentUserId = StpUtil.getLoginIdAsString();
        Quiz quiz = quizMapper.getQuizById(quizId);
        if (quiz == null) {
            throw new IllegalArgumentException(QuizConstants.NOT_FOUND);
        }
        if (!quiz.getCreator().equals(currentUserId)) {
            throw new SecurityException(QuizConstants.PERMISSION_DENIED_MSG);
        }
        return quizMapper.deleteQuiz(quizId) > 0;
    }

    /**
     * 获取问卷详情
     *
     * @param quizId 问卷ID
     * @return QuizDto 问卷数据
     */
    public QuizDto getQuizById(Long quizId) {
        if (quizId < 0) {
            return null;
        }
        Quiz quiz = quizMapper.getQuizById(quizId);
        if (quiz == null) {
            throw new IllegalArgumentException(QuizConstants.NOT_FOUND);
        }
        QuizDto quizDto = new QuizDto();
        BeanUtils.copyProperties(quiz, quizDto);
        return quizDto;
    }

    /**
     * 获取当前用户的问卷列表
     *
     * @return List<QuizDto> 问卷列表
     */
    public List<QuizDto> listQuizzesByCurrentUser() {
        String currentUserId = StpUtil.getLoginIdAsString();
        System.out.println(currentUserId);
        List<Quiz> quizzes = quizMapper.listQuizzesByCreator(currentUserId);
        System.out.println(quizzes);
        List<QuizDto> ans = quizzes.stream().map(quiz -> {
            QuizDto dto = new QuizDto();
            BeanUtils.copyProperties(quiz, dto);
            return dto;
        }).toList();
        System.out.println(ans);
        return ans;
    }

    /**
     * 批量更新问卷的问题列表（包括创建、更新、删除、排序）
     *
     * @param quizId       问卷ID
     * @param questionDtos 问题列表
     * @return 更新后的问题列表
     */
    @Transactional
    public List<QuizQuestionDto> updateQuizQuestions(Long quizId, List<QuizQuestionDto> questionDtos) {
        String currentUserId = StpUtil.getLoginIdAsString();
        Quiz quiz = quizMapper.getQuizById(quizId);
        if (quiz == null) {
            throw new IllegalArgumentException(QuizConstants.NOT_FOUND);
        }
        if (!quiz.getCreator().equals(currentUserId) && !StpUtil.hasPermission(PermissionConstants.SCOPE_QUIZ_UPDATE)) {
            throw new SecurityException(QuizConstants.PERMISSION_DENIED_MSG);
        }

        // 获取现有的问题列表
        List<Quizquestion> existingQuestions = quizQuestionMapper.listByQuizId(quizId);
        List<Long> existingQuestionIds = existingQuestions.stream()
                .map(Quizquestion::getQuizQuestionId)
                .toList();
        List<Long> newQuestionIds = questionDtos.stream()
                .map(QuizQuestionDto::getQuizQuestionId)
                .filter(Objects::nonNull)
                .toList();

        // 删除不存在于新列表中的问题
        for (Long existingId : existingQuestionIds) {
            if (!newQuestionIds.contains(existingId)) {
                quizQuestionMapper.deleteQuizQuestion(existingId);
            }
        }

        // 更新或新增问题
        List<QuizQuestionDto> updatedDtos = new ArrayList<>();
        for (int i = 0; i < questionDtos.size(); i++) {
            QuizQuestionDto dto = questionDtos.get(i);
            dto.setSort((long) i);
            dto.setQuizId(quizId);
            Quizquestion question = new Quizquestion();
            BeanUtils.copyProperties(dto, question);
            if (dto.getQuizQuestionId() == null || dto.getQuizQuestionId() <= 0) {
                quizQuestionMapper.addQuizQuestion(question);
                dto.setQuizQuestionId(question.getQuizQuestionId());
            } else {
                quizQuestionMapper.updateQuizQuestion(question);
            }
            updatedDtos.add(dto);
        }

        return updatedDtos;
    }

    public List<QuizDisplayDTO> getQuizDisplay (String value) {
        return quizMapper.listQuizDisplayInfo(value);
    }

    /**
     *  定时任务方法，用于根据当前时间更新问卷状态。
        当前时间大于结束时间自动取消发布
     */
    @Scheduled(fixedRate = 30000)
    public void updateQuizStatus() {
        log.info("quiz状态正在进行更新");
        quizMapper.updateQuizStatusByTime();
    }
}