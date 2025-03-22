create schema if not exists dhusoftware;
use dhusoftware;
create table permissions
(
    permissionId          bigint auto_increment
        primary key,
    permissionScope       varchar(255) null comment '权限范围',
    permissionDescription varchar(255) null
)
    charset = utf8mb4;

create table questiontype
(
    typeId      bigint auto_increment
        primary key,
    typeName    varchar(255) null,
    description longtext     null,
    typeSchema  longtext     null comment 'JSON SCHEMA'
)
    charset = utf8mb4;

create table question
(
    questionId          bigint auto_increment
        primary key,
    questionName        varchar(255) null,
    questionDescription longtext     null,
    questionDetails     longtext     null,
    questionTypeId      bigint       null,
    constraint question_ibfk_1
        foreign key (questionTypeId) references questiontype (typeId)
)
    charset = utf8mb4;

create index questionTypeId
    on question (questionTypeId);

create table quizpermissiontype
(
    quizPermissionTypeId   bigint auto_increment
        primary key,
    quizPermissionTypeName varchar(255) null comment '公开,需要登录,指定用户'
)
    charset = utf8mb4;

create table role
(
    roleId   bigint auto_increment
        primary key,
    roleName varchar(255) null comment '角色名'
)
    charset = utf8mb4;

create table rolepermission
(
    id           bigint auto_increment
        primary key,
    permissionId bigint null,
    roleId       bigint null,
    constraint rolepermission_ibfk_1
        foreign key (roleId) references role (roleId),
    constraint rolepermission_ibfk_2
        foreign key (permissionId) references permissions (permissionId)
)
    charset = utf8mb4;

create index permissionId
    on rolepermission (permissionId);

create index roleId
    on rolepermission (roleId);

create table user
(
    userId     varchar(255) not null
        primary key,
    userName   varchar(255) null,
    userEmail  varchar(255) null,
    userAvatar varchar(255) null
)
    charset = utf8mb4;

create table quiz
(
    quizId          bigint                               not null
        primary key,
    quizName        varchar(255)                         null,
    quizDescription longtext                             null,
    quizStartTime   timestamp  default CURRENT_TIMESTAMP not null,
    quizEndTime     timestamp  default CURRENT_TIMESTAMP not null,
    status          tinyint(1) default 1                 null,
    creator         varchar(255)                         null,
    constraint quiz_ibfk_1
        foreign key (creator) references user (userId)
)
    charset = utf8mb4;

create index creator
    on quiz (creator);

create table quizpermission
(
    id                   bigint auto_increment
        primary key,
    quizId               bigint   null,
    quizPermissionTypeId bigint   null,
    details              longtext null comment 'JSON FOR details',
    constraint quizpermission_ibfk_1
        foreign key (quizId) references quiz (quizId),
    constraint quizpermission_ibfk_2
        foreign key (quizPermissionTypeId) references quizpermissiontype (quizPermissionTypeId)
)
    charset = utf8mb4;

create index quizId
    on quizpermission (quizId);

create index quizPermissionTypeId
    on quizpermission (quizPermissionTypeId);

create table quizquestion
(
    quizQuestionId bigint auto_increment
        primary key,
    quizId         bigint null,
    questionId     bigint null,
    constraint quizquestion_ibfk_1
        foreign key (quizId) references quiz (quizId),
    constraint quizquestion_ibfk_2
        foreign key (questionId) references question (questionId)
)
    charset = utf8mb4;

create index questionId
    on quizquestion (questionId);

create index quizId
    on quizquestion (quizId);

create table quizquestionanswer
(
    answerId   bigint auto_increment
        primary key,
    quizId     bigint       null,
    questionId bigint       null,
    details    longtext     null comment 'JSON',
    answerUser varchar(255) null,
    constraint quizquestionanswer_ibfk_1
        foreign key (quizId) references quiz (quizId),
    constraint quizquestionanswer_ibfk_2
        foreign key (questionId) references question (questionId),
    constraint quizquestionanswer_user_userId_fk
        foreign key (answerUser) references user (userId)
            on update cascade on delete cascade
)
    charset = utf8mb4;

create index questionId
    on quizquestionanswer (questionId);

create index quizId
    on quizquestionanswer (quizId);

create table userrole
(
    id     bigint auto_increment
        primary key,
    userId varchar(255) null,
    roleId bigint       null,
    constraint userrole_ibfk_1
        foreign key (roleId) references role (roleId),
    constraint userrole_ibfk_2
        foreign key (userId) references user (userId)
)
    charset = utf8mb4;

create index roleId
    on userrole (roleId);

create index userId
    on userrole (userId);

