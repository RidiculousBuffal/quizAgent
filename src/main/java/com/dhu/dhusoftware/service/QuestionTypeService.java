package com.dhu.dhusoftware.service;

import com.dhu.dhusoftware.mapper.QuestionTypeMapper;
import com.dhu.dhusoftware.pojo.Questiontype;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionTypeService {
    private QuestionTypeMapper questionTypeMapper;

    public List<Questiontype> ListAllQuestionTypes() {
        return questionTypeMapper.listAllQuestionTypes();
    }
}
