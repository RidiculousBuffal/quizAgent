package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Questiontype;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuestionTypeMapper {
    @Insert("INSERT INTO questiontype(typeName, description, typeSchema) VALUES (#{typeName}, #{description}, #{typeSchema})")
    @Options(useGeneratedKeys = true, keyProperty = "typeId")
    int addQuestionType(Questiontype questionType);

    @Select("SELECT * FROM questiontype WHERE typeId = #{typeId}")
    Questiontype getQuestionTypeById(Long typeId);

    @Update("UPDATE questiontype SET typeName = #{typeName}, description = #{description}, typeSchema = #{typeSchema} WHERE typeId = #{typeId}")
    int updateQuestionType(Questiontype questionType);

    @Delete("DELETE FROM questiontype WHERE typeId = #{typeId}")
    int deleteQuestionType(Long typeId);

    @Select("SELECT * FROM questiontype")
    List<Questiontype> listAllQuestionTypes();
}