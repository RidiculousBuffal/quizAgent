alter table quizquestion
    drop foreign key quizquestion_ibfk_1;

alter table quizquestion
    add constraint quizquestion_ibfk_1
        foreign key (quizId) references quiz (quizId)
            on update cascade on delete cascade;

alter table quizquestion
    drop foreign key quizquestion_ibfk_2;

alter table quizquestion
    add constraint quizquestion_ibfk_2
        foreign key (questionId) references question (questionId)
            on update cascade on delete cascade;

