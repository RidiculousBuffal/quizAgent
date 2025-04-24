package com.dhu.dhusoftware.service.question;

import com.dhu.dhusoftware.ai.jsonSchema.CheckboxQuestion;
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
public class CheckboxQuestionService {
    @Autowired
    private QuestionMapper questionMapper;

    private static final ObjectMapper mapper = new ObjectMapper();

    public String processAndSaveCheckboxQuestion(CheckboxQuestion checkboxQuestion, Long quizId) throws Exception {
        // Step 1: Convert to JSON (no validators needed for Checkbox)
        String jsonDetails = mapper.writeValueAsString(checkboxQuestion);

        // Step 2: Save to question table
        Question question = new Question();
        question.setQuestionName(checkboxQuestion.title());
        question.setQuestionDescription(checkboxQuestion.description());
        question.setQuestionDetails(jsonDetails);
        question.setQuestionTypeId(2L); // Default to 2 for Checkbox
        questionMapper.insertQuestion(question);

        // Step 3: Fetch questionType details
        Questiontype questionType = questionMapper.selectQuestionTypeById(2L);
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