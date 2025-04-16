package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Quizpermissiontype;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuizPermissionTypeMapper {
    @Insert("INSERT INTO quizpermissiontype(quizPermissionTypeName) VALUES (#{quizPermissionTypeName})")
    @Options(useGeneratedKeys = true, keyProperty = "quizPermissionTypeId")
    int addQuizPermissionType(Quizpermissiontype permissionType);

    @Select("SELECT * FROM quizpermissiontype WHERE quizPermissionTypeId = #{quizPermissionTypeId}")
    Quizpermissiontype getQuizPermissionTypeById(Long quizPermissionTypeId);

    @Update("UPDATE quizpermissiontype SET quizPermissionTypeName = #{quizPermissionTypeName} WHERE quizPermissionTypeId = #{quizPermissionTypeId}")
    int updateQuizPermissionType(Quizpermissiontype permissionType);

    @Delete("DELETE FROM quizpermissiontype WHERE quizPermissionTypeId = #{quizPermissionTypeId}")
    int deleteQuizPermissionType(Long quizPermissionTypeId);

    @Select("SELECT * FROM quizpermissiontype")
    List<Quizpermissiontype> listAllQuizPermissionTypes();
}