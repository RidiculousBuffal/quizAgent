package com.dhu.dhusoftware.pojo;


public class Quizquestionanswer {

  private long answerId;
  private long quizId;
  private long questionId;
  private String details;
  private String answerUser;


  public long getAnswerId() {
    return answerId;
  }

  public void setAnswerId(long answerId) {
    this.answerId = answerId;
  }


  public long getQuizId() {
    return quizId;
  }

  public void setQuizId(long quizId) {
    this.quizId = quizId;
  }


  public long getQuestionId() {
    return questionId;
  }

  public void setQuestionId(long questionId) {
    this.questionId = questionId;
  }


  public String getDetails() {
    return details;
  }

  public void setDetails(String details) {
    this.details = details;
  }


  public String getAnswerUser() {
    return answerUser;
  }

  public void setAnswerUser(String answerUser) {
    this.answerUser = answerUser;
  }

}
