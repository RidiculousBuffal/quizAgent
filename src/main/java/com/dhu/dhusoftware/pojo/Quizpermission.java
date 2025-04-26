package com.dhu.dhusoftware.pojo;


import lombok.Data;

@Data
public class Quizpermission {

  private Long id;
  private Long quizId;
  private Long quizPermissionTypeId;
  private String details;

}
