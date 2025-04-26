package com.dhu.dhusoftware.service;

import com.dhu.dhusoftware.dto.QuizQuestionDetailDTO;
import com.dhu.dhusoftware.mapper.QuestionMapper;
import com.dhu.dhusoftware.mapper.QuizQuestionMapper;
import com.dhu.dhusoftware.pojo.Question;
import com.dhu.dhusoftware.constant.QuizConstants;
import com.dhu.dhusoftware.pojo.Quizquestion;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QuestionService {

    @Autowired
    private QuestionMapper questionMapper;
    @Autowired
    private QuizQuestionMapper quizQuestionMapper;

    /**
     * Jackson 全局复⽤即可
     */
    private ObjectMapper objectMapper;

    @PostConstruct
    public void init() {
        this.objectMapper = new ObjectMapper();
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean saveOrUpdateQuestion(ArrayList<Map<String, Object>> payload, Long quizId) {

        for (Map<String, Object> p : payload) {

            /* ---------- 1. 基础字段解析 ---------- */
            Long id = p.get("id") == null ? null : Long.valueOf(p.get("id").toString());
            Long sort = p.get("sort") == null ? null : Long.valueOf(p.get("sort").toString());

            Map<String, Object> typeMap = (Map<String, Object>) p.get("type");
            Long typeId = typeMap == null ? null :
                    Long.valueOf(typeMap.get("typeId").toString());

            /* ---------- 2. 处理 questionDetails ---------- */
            Map<String, Object> detailsMap = new HashMap<>(p);
            detailsMap.remove("id");
            detailsMap.remove("sort");
            detailsMap.remove("type");

            String questionDetailsJson;
            try {
                questionDetailsJson = objectMapper.writeValueAsString(detailsMap);
            } catch (Exception e) {
                throw new RuntimeException("序列化 questionDetails 失败", e);
            }

            /* 可选：从详情里抽取 title / description 作为名称 */
            String title = (String) detailsMap.getOrDefault("title", null);
            String description = (String) detailsMap.getOrDefault("description", null);
            Question question = null;
            question = questionMapper.getQuestionById(id);
            if (question == null) {
                question = new Question();
                question.setQuestionId(id);
                question.setQuestionName(title);
                question.setQuestionDescription(description);
                question.setQuestionDetails(questionDetailsJson);
                question.setQuestionTypeId(typeId);
                questionMapper.insertQuestionWithId(question);   // 自增 id 回填
            } else {                                     // ===> 更新
                question.setQuestionName(title);
                question.setQuestionDescription(description);
                question.setQuestionDetails(questionDetailsJson);
                question.setQuestionTypeId(typeId);
                questionMapper.updateQuestion(question);
            }

            /* ---------- 4. 维护 quizquestion 关系 ---------- */
            // ① 判断该题是否已在当前 quiz 里
            Quizquestion existed = quizQuestionMapper.getByQuizIdAndQuestionId(quizId, id);

            // ② 如果没有 -> 插⼊，并给 sort 自动补位
            if (existed == null) {
                if (sort == null) {                                     // 前端没给 sort
                    sort = questionMapper.getNextSortByQuizId(quizId);  // 顺位递增
                }
                Quizquestion qq = new Quizquestion();
                qq.setQuizId(quizId);
                qq.setQuestionId(id);
                qq.setSort(sort);
                quizQuestionMapper.addQuizQuestion(qq);

                // ③ 如果有 -> 只在 sort 变化时更新
            } else if (sort != null && !sort.equals(existed.getSort())) {
                existed.setSort(sort);
                quizQuestionMapper.updateQuizQuestion(existed);
            }
        }
        return true;
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
     * 获取指定问卷的所有问题详情，按排序字段排列
     *
     * @param quizId 问卷ID
     * @return List<QuizQuestionDetailDTO> 问题详情列表
     */
    public List<QuizQuestionDetailDTO> getQuizQuestionDetailsByQuizId(Long quizId) {
        return quizQuestionMapper.listQuizQuestionDetails(quizId);
    }
}