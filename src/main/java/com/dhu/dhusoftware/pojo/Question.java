package com.dhu.dhusoftware.pojo;


public class Question {

  private long questionId;
  private String questionName;
  private String questionDescription;
  private String questionDetails;
  private long questionTypeId;


  public long getQuestionId() {
    return questionId;
  }

  public void setQuestionId(long questionId) {
    this.questionId = questionId;
  }


  public String getQuestionName() {
    return questionName;
  }

  public void setQuestionName(String questionName) {
    this.questionName = questionName;
  }


  public String getQuestionDescription() {
    return questionDescription;
  }

  public void setQuestionDescription(String questionDescription) {
    this.questionDescription = questionDescription;
  }


  public String getQuestionDetails() {
    return questionDetails;
  }

  public void setQuestionDetails(String questionDetails) {
    this.questionDetails = questionDetails;
  }


  public long getQuestionTypeId() {
    return questionTypeId;
  }

  public void setQuestionTypeId(long questionTypeId) {
    this.questionTypeId = questionTypeId;
  }

}
