create database feature_quiz;
use feature_quiz;
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
    quizId          bigint auto_increment
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

create table aianswerhistory
(
    historyId        bigint auto_increment
        primary key,
    userId           varchar(255)                         not null comment '操作者用户ID',
    quizId           bigint                               not null comment '关联的问卷ID',
    inputParams      longtext                             null comment '用户输入的参数（JSON格式，如用户画像）',
    generatedAnswers longtext                             null comment 'AI生成的答案内容（JSON格式）',
    generationTime   timestamp  default CURRENT_TIMESTAMP not null comment '生成时间',
    status           tinyint(1) default 1                 null comment '状态：1成功，0失败',
    errorMsg         longtext                             null comment '生成失败时的错误信息',
    constraint aianswerhistory_ibfk_1
        foreign key (userId) references user (userId),
    constraint aianswerhistory_ibfk_2
        foreign key (quizId) references quiz (quizId)
)
    charset = utf8mb4;

create index quizId
    on aianswerhistory (quizId);

create index userId
    on aianswerhistory (userId);

create table aigenerationhistory
(
    historyId       bigint auto_increment
        primary key,
    userId          varchar(255)                         not null comment '生成者用户ID',
    quizId          bigint                               null comment '关联的问卷ID（生成后保存为问卷）',
    inputPrompt     longtext                             null comment '用户输入的提示词（JSON格式）',
    generatedResult longtext                             null comment 'AI生成的问卷内容（JSON格式）',
    generationTime  timestamp  default CURRENT_TIMESTAMP not null comment '生成时间',
    status          tinyint(1) default 1                 null comment '状态：1成功，0失败',
    errorMsg        longtext                             null comment '生成失败时的错误信息',
    constraint aigenerationhistory_ibfk_1
        foreign key (userId) references user (userId),
    constraint aigenerationhistory_ibfk_2
        foreign key (quizId) references quiz (quizId)
)
    charset = utf8mb4;

create index quizId
    on aigenerationhistory (quizId);

create index userId
    on aigenerationhistory (userId);

create index creator
    on quiz (creator);

create table quizdistribution
(
    distributionId     bigint auto_increment
        primary key,
    quizId             bigint                               not null comment '问卷ID',
    distributionType   varchar(255)                         null comment '分发类型：链接、邮件、系统通知等',
    distributionTarget longtext                             null comment '分发目标：JSON格式，如用户ID列表或邮件地址',
    distributionTime   timestamp  default CURRENT_TIMESTAMP not null comment '分发时间',
    status             tinyint(1) default 1                 null comment '状态：1已分发，0失效',
    creator            varchar(255)                         null comment '分发者',
    constraint quizdistribution_ibfk_1
        foreign key (quizId) references quiz (quizId),
    constraint quizdistribution_ibfk_2
        foreign key (creator) references user (userId)
)
    charset = utf8mb4;

create index creator
    on quizdistribution (creator);

create index quizId
    on quizdistribution (quizId);

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

create index quizPermissionTypeId
    on quizpermission (quizPermissionTypeId);

create table quizquestion
(
    quizQuestionId bigint auto_increment
        primary key,
    quizId         bigint null,
    questionId     bigint null,
    sort           bigint null,
    constraint quizquestion_ibfk_1
        foreign key (quizId) references quiz (quizId)
            on update cascade on delete cascade,
    constraint quizquestion_ibfk_2
        foreign key (questionId) references question (questionId)
            on update cascade on delete cascade
)
    charset = utf8mb4;

create table quizquestionanswer
(
    answerId       bigint auto_increment
        primary key,
    quizId         bigint                              null,
    questionId     bigint                              null,
    details        longtext                            null comment 'JSON',
    answerUser     varchar(255)                        null,
    uniqueSubmitId varchar(255)                        null,
    answerTime     timestamp default CURRENT_TIMESTAMP not null,
    constraint quizquestionanswer_ibfk_1
        foreign key (quizId) references quiz (quizId)
            on update cascade on delete cascade,
    constraint quizquestionanswer_ibfk_2
        foreign key (questionId) references question (questionId),
    constraint quizquestionanswer_user_userId_fk
        foreign key (answerUser) references user (userId)
            on update cascade on delete cascade
)
    charset = utf8mb4;

create index questionId
    on quizquestionanswer (questionId);

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

INSERT INTO questiontype (typeId, typeName, description, typeSchema)
VALUES (1, 'radio', '单选题', null);
INSERT INTO questiontype (typeId, typeName, description, typeSchema)
VALUES (2, 'checkbox', '多选题', null);
INSERT INTO questiontype (typeId, typeName, description, typeSchema)
VALUES (3, 'fillblank', '填空题', null);
INSERT INTO questiontype (typeId, typeName, description, typeSchema)
VALUES (4, 'essay', '简答题', null);
INSERT INTO questiontype (typeId, typeName, description, typeSchema)
VALUES (5, 'file', '文件题', null);
INSERT INTO quizpermissiontype (quizPermissionTypeId, quizPermissionTypeName)
VALUES (1, 'public');
INSERT INTO quizpermissiontype (quizPermissionTypeId, quizPermissionTypeName)
VALUES (2, 'private');
