package com.dhu.dhusoftware.pojo;


public class Quizpermission {

  private long id;
  private long quizId;
  private long quizPermissionTypeId;
  private String details;


  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }


  public long getQuizId() {
    return quizId;
  }

  public void setQuizId(long quizId) {
    this.quizId = quizId;
  }


  public long getQuizPermissionTypeId() {
    return quizPermissionTypeId;
  }

  public void setQuizPermissionTypeId(long quizPermissionTypeId) {
    this.quizPermissionTypeId = quizPermissionTypeId;
  }


  public String getDetails() {
    return details;
  }

  public void setDetails(String details) {
    this.details = details;
  }

}
