package com.dhu.dhusoftware.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Quiz {
  private Long quizId;
  private String quizName;
  private String quizDescription;
  private java.sql.Timestamp quizStartTime;
  private java.sql.Timestamp quizEndTime;
  private long status;
  private String creator;


}
