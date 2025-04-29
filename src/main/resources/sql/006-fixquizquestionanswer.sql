alter table quizquestionanswer
    drop foreign key quizquestionanswer_ibfk_1;

alter table quizquestionanswer
    add constraint quizquestionanswer_ibfk_1
        foreign key (quizId) references quiz (quizId)
            on update cascade on delete cascade;

