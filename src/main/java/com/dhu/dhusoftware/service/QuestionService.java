package com.dhu.dhusoftware.service;

import com.dhu.dhusoftware.dto.QuestionDto;
import com.dhu.dhusoftware.mapper.QuestionMapper;
import com.dhu.dhusoftware.mapper.QuizMapper;
import com.dhu.dhusoftware.mapper.QuizQuestionMapper;
import com.dhu.dhusoftware.pojo.Question;
import com.dhu.dhusoftware.constant.QuizConstants;
import com.dhu.dhusoftware.pojo.Quiz;
import com.dhu.dhusoftware.pojo.Quizquestion;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 问题服务层，处理问题创建、更新等逻辑
 */
@Service
public class QuestionService {

    @Autowired
    private QuestionMapper questionMapper;
    @Autowired
    private QuizMapper quizMapper;
    @Autowired
    private QuizQuestionMapper quizQuestionMapper;

    /**
     * 创建或更新问题
     *
     * @param questionDto 问题数据传输对象
     * @return QuestionDto 更新后的问题数据
     */
    public QuestionDto saveOrUpdateQuestion(QuestionDto questionDto) {
        Question question = new Question();
        BeanUtils.copyProperties(questionDto, question);

        if (question.getQuestionId() == null || question.getQuestionId() <= 0) {
            // 新建问题
            questionMapper.insertQuestion(question);
        } else {
            // 更新问题
            Question existingQuestion = questionMapper.getQuestionById(question.getQuestionId());
            if (existingQuestion == null) {
                throw new IllegalArgumentException(QuizConstants.NOT_FOUND);
            }
            questionMapper.updateQuestion(question);
        }

        QuestionDto resultDto = new QuestionDto();
        BeanUtils.copyProperties(question, resultDto);
        return resultDto;
    }

    /**
     * 删除问题
     *
     * @param questionId 问题ID
     * @return 是否成功
     */
    public boolean deleteQuestion(Long questionId) {
        Question question = questionMapper.getQuestionById(questionId);
        if (question == null) {
            throw new IllegalArgumentException(QuizConstants.NOT_FOUND);
        }
        return questionMapper.deleteQuestion(questionId) > 0;
    }

    /**
     * 获取问题详情
     *
     * @param questionId 问题ID
     * @return QuestionDto 问题数据
     */
    public QuestionDto getQuestionById(Long questionId) {
        Question question = questionMapper.getQuestionById(questionId);
        if (question == null) {
            throw new IllegalArgumentException(QuizConstants.NOT_FOUND);
        }
        QuestionDto questionDto = new QuestionDto();
        BeanUtils.copyProperties(question, questionDto);
        return questionDto;
    }

    /**
     * 获取所有问题列表
     *
     * @return List<QuestionDto> 问题列表
     */
    public List<QuestionDto> listAllQuestions() {
        List<Question> questions = questionMapper.listAllQuestions();
        return questions.stream().map(question -> {
            QuestionDto dto = new QuestionDto();
            BeanUtils.copyProperties(question, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * 获取指定问卷的所有问题详情，按排序字段排列
     *
     * @param quizId 问卷ID
     * @return List<QuestionDto> 问题详情列表
     */
    public List<QuestionDto> getQuizQuestionDetailsByQuizId(Long quizId) {
        Quiz quiz = quizMapper.getQuizById(quizId);
        if (quiz == null) {
            throw new IllegalArgumentException(QuizConstants.NOT_FOUND);
        }
        List<Quizquestion> quizQuestions = quizQuestionMapper.listByQuizId(quizId);
        return quizQuestions.stream().map(quizQuestion -> {
            Question question = questionMapper.getQuestionById(quizQuestion.getQuestionId());
            QuestionDto dto = new QuestionDto();
            BeanUtils.copyProperties(question, dto);
            return dto;
        }).collect(Collectors.toList());
    }
}