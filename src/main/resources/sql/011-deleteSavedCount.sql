alter table aianswerhistory
    drop column savedCount;

alter table aianswerhistory
    drop foreign key aianswerhistory_ibfk_2;

alter table aianswerhistory
    add constraint aianswerhistory_ibfk_2
        foreign key (quizId) references quiz (quizId);

