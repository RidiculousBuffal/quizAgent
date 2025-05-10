alter table quizpermission
    drop foreign key quizpermission_ibfk_1;

alter table quizpermission
    add constraint quizpermission_ibfk_1
        foreign key (quizId) references quiz (quizId)
            on delete cascade;

alter table quizpermission
    drop foreign key quizpermission_ibfk_2;

alter table quizpermission
    add constraint quizpermission_ibfk_2
        foreign key (quizPermissionTypeId) references quizpermissiontype (quizPermissionTypeId)
            on update cascade;

alter table aianswerhistory
    drop foreign key aianswerhistory_ibfk_1;

alter table aianswerhistory
    add constraint aianswerhistory_ibfk_1
        foreign key (userId) references user (userId)
            on update cascade on delete cascade;

alter table aianswerhistory
    drop foreign key aianswerhistory_ibfk_2;

alter table aianswerhistory
    add constraint aianswerhistory_ibfk_2
        foreign key (quizId) references quiz (quizId)
            on update cascade on delete cascade;

alter table aigenerationhistory
    drop foreign key aigenerationhistory_ibfk_1;

alter table aigenerationhistory
    add constraint aigenerationhistory_ibfk_1
        foreign key (userId) references user (userId)
            on update cascade on delete cascade;

alter table aigenerationhistory
    drop foreign key aigenerationhistory_ibfk_2;

alter table aigenerationhistory
    add constraint aigenerationhistory_ibfk_2
        foreign key (quizId) references quiz (quizId)
            on update cascade on delete cascade;

alter table quizdistribution
    drop foreign key quizdistribution_ibfk_1;

alter table quizdistribution
    add constraint quizdistribution_ibfk_1
        foreign key (quizId) references quiz (quizId)
            on update cascade on delete cascade;

alter table quizdistribution
    drop foreign key quizdistribution_ibfk_2;

alter table quizdistribution
    add constraint quizdistribution_ibfk_2
        foreign key (creator) references user (userId)
            on update cascade on delete cascade;

alter table quizpermission
    drop foreign key quizpermission_ibfk_1;

alter table quizpermission
    add constraint quizpermission_ibfk_1
        foreign key (quizId) references quiz (quizId)
            on update cascade on delete cascade;

alter table quizpermission
    drop foreign key quizpermission_ibfk_2;

alter table quizpermission
    add constraint quizpermission_ibfk_2
        foreign key (quizPermissionTypeId) references quizpermissiontype (quizPermissionTypeId)
            on update cascade on delete cascade;

alter table quizquestionanswer
    drop foreign key quizquestionanswer_ibfk_2;

alter table quizquestionanswer
    add constraint quizquestionanswer_ibfk_2
        foreign key (questionId) references question (questionId)
            on update cascade on delete cascade;

