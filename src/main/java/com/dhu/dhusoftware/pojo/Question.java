package com.dhu.dhusoftware.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Question {

  private Long questionId;
  private String questionName;
  private String questionDescription;
  private String questionDetails;
  private Long questionTypeId;


}
