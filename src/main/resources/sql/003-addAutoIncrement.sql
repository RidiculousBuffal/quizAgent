alter table quizdistribution
    drop foreign key quizdistribution_ibfk_1;

alter table quizpermission
    drop foreign key quizpermission_ibfk_1;

alter table quizquestion
    drop foreign key quizquestion_ibfk_1;

alter table quizquestionanswer
    drop foreign key quizquestionanswer_ibfk_1;

alter table aianswerhistory
    drop foreign key aianswerhistory_ibfk_2;

alter table aigenerationhistory
    drop foreign key aigenerationhistory_ibfk_2;



alter table quiz
    modify quizId bigint auto_increment;

alter table quiz
    auto_increment = 1;

ALTER TABLE quizdistribution
    ADD CONSTRAINT quizdistribution_ibfk_1
        FOREIGN KEY (quizId) REFERENCES quiz(quizId);

ALTER TABLE quizpermission
    ADD CONSTRAINT quizpermission_ibfk_1
        FOREIGN KEY (quizId) REFERENCES quiz(quizId);

ALTER TABLE quizquestion
    ADD CONSTRAINT quizquestion_ibfk_1
        FOREIGN KEY (quizId) REFERENCES quiz(quizId);

ALTER TABLE quizquestionanswer
    ADD CONSTRAINT quizquestionanswer_ibfk_1
        FOREIGN KEY (quizId) REFERENCES quizquestion(quizQuestionId);

ALTER TABLE aianswerhistory
    ADD CONSTRAINT aianswerhistory_ibfk_2
        FOREIGN KEY (quizId) REFERENCES quizquestion(quizQuestionId);

ALTER TABLE aigenerationhistory
    ADD CONSTRAINT aigenerationhistory_ibfk_2
        FOREIGN KEY (quizId) REFERENCES quizquestion(quizQuestionId);



