package com.dhu.dhusoftware.service;

import com.dhu.dhusoftware.ai.jsonSchema.AnswerType;
import com.dhu.dhusoftware.ai.jsonSchema.FillBlankQuestion;
import com.dhu.dhusoftware.mapper.QuestionMapper;
import com.dhu.dhusoftware.pojo.Question;
import com.dhu.dhusoftware.pojo.Questiontype;
import com.dhu.dhusoftware.pojo.Quizquestion;
import com.dhu.dhusoftware.service.question.FillBlankQuestionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test") // 可选：使用测试配置文件
public class FillBlankQuestionServiceTest {

    @Mock
    private QuestionMapper questionMapper;

    @InjectMocks
    private FillBlankQuestionService fillBlankQuestionService;

    private FillBlankQuestion fillBlank;
    private Questiontype questionType;
    private final Long quizId = 1L;
    private final Long questionId = 1001L;
    private final Long sort = 5L;
    private static final ObjectMapper mapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        // 初始化 FillBlank 对象
        fillBlank = new FillBlankQuestion(
                "完成句子",
                "请在空白处填入适当的词语",
                true,
                3,
                Arrays.asList("国家", "城市", "年份"),
                AnswerType.text,
                Arrays.asList(
                        Arrays.asList("中国"),
                        Arrays.asList("北京"),
                        Arrays.asList("1949")
                ),
                "填写此处",
                true,
                "{{blank}}的首都是{{blank}}，成立于{{blank}}年。"
        );

        // 初始化 Questiontype 对象
        questionType = new Questiontype();
        questionType.setTypeId(3L);
        questionType.setTypeName("input");
        questionType.setDescription("填空题");
    }

    @Test
    void testProcessAndSaveFillBlank_Success() throws Exception {
        // 模拟 QuestionMapper 的行为
        Question question = new Question();
        question.setQuestionId(questionId);
        question.setQuestionName(fillBlank.title());
        question.setQuestionDescription(fillBlank.description());
        question.setQuestionTypeId(3L);

        // 模拟插入 Question 后的 ID 返回
        doAnswer(invocation -> {
            Question q = invocation.getArgument(0);
            q.setQuestionId(questionId);
            return null;
        }).when(questionMapper).insertQuestion(any(Question.class));

        // 模拟查询 Questiontype
        when(questionMapper.selectQuestionTypeById(3L)).thenReturn(questionType);

        // 模拟获取 sort 值
        when(questionMapper.getNextSortByQuizId(quizId)).thenReturn(sort);

        // 模拟插入 Quizquestion
        doNothing().when(questionMapper).insertQuizQuestion(any(Quizquestion.class));

        // 调用服务方法
        String resultJson = fillBlankQuestionService.processAndSaveFillBlankQuestion(fillBlank, quizId);

        System.out.println(resultJson);
        // 验证结果
        assertNotNull(resultJson);
        assertTrue(resultJson.contains("\"id\":" + questionId));
        assertTrue(resultJson.contains("\"sort\":" + sort));
        assertTrue(resultJson.contains("\"typeId\":3"));
        assertTrue(resultJson.contains("\"typeName\":\"input\""));
        assertTrue(resultJson.contains("\"validators\":[[],[],[]]"));

        // 验证数据库操作被调用
        verify(questionMapper, times(1)).insertQuestion(any(Question.class));
        verify(questionMapper, times(1)).selectQuestionTypeById(3L);
        verify(questionMapper, times(1)).getNextSortByQuizId(quizId);
        verify(questionMapper, times(1)).insertQuizQuestion(any(Quizquestion.class));
    }

    @Test
    void testProcessAndSaveFillBlank_JsonParsingError() {
        // 此测试需要修改 JsonRecordProcessor 或其他逻辑以模拟 JSON 解析错误
        // 这里简单验证异常处理，实际可根据需求添加
        assertThrows(Exception.class, () -> {
            FillBlankQuestion invalidFillBlank = new FillBlankQuestion("", "", false, -1, null, null, null, "", false, "");
            fillBlankQuestionService.processAndSaveFillBlankQuestion(invalidFillBlank, quizId);
        });
    }
}