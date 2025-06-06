package com.dhu.dhusoftware.mapper;

import com.dhu.dhusoftware.pojo.Quizpermission;
import org.apache.ibatis.annotations.*;

@Mapper
public interface QuizPermissionMapper {
    @Insert("INSERT INTO quizpermission(quizId, quizPermissionTypeId, details) VALUES (#{quizId}, #{quizPermissionTypeId}, #{details})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int addQuizPermission(Quizpermission permission);

    @Select("SELECT * FROM quizpermission WHERE id = #{id}")
    Quizpermission getQuizPermissionById(Long id);

    @Update("UPDATE quizpermission SET quizPermissionTypeId = #{quizPermissionTypeId}, details = #{details} WHERE id = #{id}")
    int updateQuizPermission(Quizpermission permission);

    @Delete("DELETE FROM quizpermission WHERE quizId = #{quizId}")
    int deleteQuizPermission(Long quizId);

    @Select("SELECT * FROM quizpermission WHERE quizId = #{quizId}")
    Quizpermission getQuizPermissionByQuizId(Long quizId);
}