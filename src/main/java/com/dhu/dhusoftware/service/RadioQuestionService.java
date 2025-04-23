package com.dhu.dhusoftware.service;

import com.dhu.dhusoftware.aiJson.RadioQuestion;
import com.dhu.dhusoftware.mapper.QuestionMapper;
import com.dhu.dhusoftware.pojo.Question;
import com.dhu.dhusoftware.pojo.Questiontype;
import com.dhu.dhusoftware.pojo.Quizquestion;
import com.dhu.dhusoftware.utils.JsonRecordProcessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RadioQuestionService {
    @Autowired
    private QuestionMapper questionMapper;

    private static final ObjectMapper mapper = new ObjectMapper();

    public String processAndSaveRadioQuestion(RadioQuestion radioQuestion, Long quizId) throws Exception {
        // Step 1: Convert to JSON (no validators needed for Radio)
        String jsonDetails = mapper.writeValueAsString(radioQuestion);

        // Step 2: Save to question table
        Question question = new Question();
        question.setQuestionName(radioQuestion.title());
        question.setQuestionDescription(radioQuestion.description());
        question.setQuestionDetails(jsonDetails);
        question.setQuestionTypeId(1L); // Default to 1 for Radio
        questionMapper.insertQuestion(question);

        // Step 3: Fetch questionType details
        Questiontype questionType = questionMapper.selectQuestionTypeById(1L);
        ObjectNode typeNode = mapper.createObjectNode();
        typeNode.put("typeId", questionType.getTypeId());
        typeNode.put("typeName", questionType.getTypeName());
        typeNode.put("typeDescription", questionType.getDescription());

        // Step 4: Enhance JSON with id and type
        Long questionId = question.getQuestionId();
        jsonDetails = JsonRecordProcessor.enhanceJsonWithTypeAndId(jsonDetails, questionId, typeNode);

        // Step 5: Determine sort value based on quizId
        Long sort = questionMapper.getNextSortByQuizId(quizId);
        jsonDetails = JsonRecordProcessor.addSortToJson(jsonDetails, sort);

        // Step 6: Save to quizquestion table
        Quizquestion quizQuestion = new Quizquestion();
        quizQuestion.setQuizId(quizId);
        quizQuestion.setQuestionId(questionId);
        quizQuestion.setSort(sort);
        questionMapper.insertQuizQuestion(quizQuestion);

        // Step 7: Return the final JSON to frontend
        return jsonDetails;
    }
}