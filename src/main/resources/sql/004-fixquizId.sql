alter table aigenerationhistory
    drop foreign key aigenerationhistory_ibfk_2;

alter table aigenerationhistory
    add constraint aigenerationhistory_ibfk_2
        foreign key (quizId) references quiz (quizId);

