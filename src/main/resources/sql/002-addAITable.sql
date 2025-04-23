create table quizdistribution
(
    distributionId    bigint auto_increment
        primary key,
    quizId            bigint       not null comment '问卷ID',
    distributionType  varchar(255) null comment '分发类型：链接、邮件、系统通知等',
    distributionTarget longtext     null comment '分发目标：JSON格式，如用户ID列表或邮件地址',
    distributionTime  timestamp default CURRENT_TIMESTAMP not null comment '分发时间',
    status            tinyint(1) default 1 null comment '状态：1已分发，0失效',
    creator           varchar(255) null comment '分发者',
    constraint quizdistribution_ibfk_1
        foreign key (quizId) references quiz (quizId),
    constraint quizdistribution_ibfk_2
        foreign key (creator) references user (userId)
)
    charset = utf8mb4;

create index quizId
    on quizdistribution (quizId);

create index creator
    on quizdistribution (creator);



create table aigenerationhistory
(
    historyId       bigint auto_increment
        primary key,
    userId          varchar(255) not null comment '生成者用户ID',
    quizId          bigint       null comment '关联的问卷ID（生成后保存为问卷）',
    inputPrompt     longtext     null comment '用户输入的提示词（JSON格式）',
    generatedResult longtext     null comment 'AI生成的问卷内容（JSON格式）',
    generationTime  timestamp default CURRENT_TIMESTAMP not null comment '生成时间',
    status          tinyint(1) default 1 null comment '状态：1成功，0失败',
    errorMsg        longtext     null comment '生成失败时的错误信息',
    constraint aigenerationhistory_ibfk_1
        foreign key (userId) references user (userId),
    constraint aigenerationhistory_ibfk_2
        foreign key (quizId) references quiz (quizId)
)
    charset = utf8mb4;

create index userId
    on aigenerationhistory (userId);

create index quizId
    on aigenerationhistory (quizId);


create table aianswerhistory
(
    historyId       bigint auto_increment
        primary key,
    userId          varchar(255) not null comment '操作者用户ID',
    quizId          bigint       not null comment '关联的问卷ID',
    inputParams     longtext     null comment '用户输入的参数（JSON格式，如用户画像）',
    generatedAnswers longtext    null comment 'AI生成的答案内容（JSON格式）',
    generationTime  timestamp default CURRENT_TIMESTAMP not null comment '生成时间',
    status          tinyint(1) default 1 null comment '状态：1成功，0失败',
    errorMsg        longtext     null comment '生成失败时的错误信息',
    savedCount      int          default 0 null comment '保存到系统的答案份数',
    constraint aianswerhistory_ibfk_1
        foreign key (userId) references user (userId),
    constraint aianswerhistory_ibfk_2
        foreign key (quizId) references quiz (quizId)
)
    charset = utf8mb4;

create index userId
    on aianswerhistory (userId);

create index quizId
    on aianswerhistory (quizId);