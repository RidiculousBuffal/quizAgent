package com.dhu.dhusoftware.pojo;


public class Quiz {

  private long quizId;
  private String quizName;
  private String quizDescription;
  private java.sql.Timestamp quizStartTime;
  private java.sql.Timestamp quizEndTime;
  private long status;
  private String creator;


  public long getQuizId() {
    return quizId;
  }

  public void setQuizId(long quizId) {
    this.quizId = quizId;
  }


  public String getQuizName() {
    return quizName;
  }

  public void setQuizName(String quizName) {
    this.quizName = quizName;
  }


  public String getQuizDescription() {
    return quizDescription;
  }

  public void setQuizDescription(String quizDescription) {
    this.quizDescription = quizDescription;
  }


  public java.sql.Timestamp getQuizStartTime() {
    return quizStartTime;
  }

  public void setQuizStartTime(java.sql.Timestamp quizStartTime) {
    this.quizStartTime = quizStartTime;
  }


  public java.sql.Timestamp getQuizEndTime() {
    return quizEndTime;
  }

  public void setQuizEndTime(java.sql.Timestamp quizEndTime) {
    this.quizEndTime = quizEndTime;
  }


  public long getStatus() {
    return status;
  }

  public void setStatus(long status) {
    this.status = status;
  }


  public String getCreator() {
    return creator;
  }

  public void setCreator(String creator) {
    this.creator = creator;
  }

}
