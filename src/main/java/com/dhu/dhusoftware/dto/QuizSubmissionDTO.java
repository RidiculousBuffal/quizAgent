package com.dhu.dhusoftware.dto;

import java.util.List;

public class QuizSubmissionDTO {
    private Long quizId;
    private List<QuestionAnswerDTO> answers;

    // Getters and setters
    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public List<QuestionAnswerDTO> getAnswers() {
        return answers;
    }

    public void setAnswers(List<QuestionAnswerDTO> answers) {
        this.answers = answers;
    }

    // Inner class for question answers
    public static class QuestionAnswerDTO {
        private Long questionId;
        private Object answer;

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public Object getAnswer() {
            return answer;
        }

        public void setAnswer(Object answer) {
            this.answer = answer;
        }
    }
}