package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Questiontype;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuestionTypeMapper {
    @Select("SELECT * FROM questiontype")
    List<Questiontype> listAllQuestionTypes();
}