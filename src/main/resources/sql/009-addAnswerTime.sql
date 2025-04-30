alter table quizquestionanswer
    add answerTime timestamp not null default now();
