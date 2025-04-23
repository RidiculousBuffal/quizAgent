// 模拟后端 JSON 数据
export const mockQuestionsJSON = [
    // 基础单填空题
    {
        id: "input_test_1",
        type: { typeId: 4, typeName: "input", typeDescription: "填空题" },
        title: "基础文本输入",
        description: "请输入您的姓名",
        placeholder: "请在此输入...",
        required: true,
        maxLength: 50,
        blankCount: 1,
        blankLabels: ["姓名"],
        answerType: "text",
        validators: [[]],
        correctAnswers: [["张三", "李四", "王五"]],
        inlineMode: false
    },
    // 多填空题 - 标准模式
    {
        id: "input_test_2",
        type: { typeId: 4, typeName: "input", typeDescription: "填空题" },
        title: "个人基本信息",
        description: "请填写您的基本个人信息",
        required: true,
        blankCount: 3,
        blankLabels: ["姓名", "年龄", "职业"],
        answerType: "text",
        correctAnswers: [
            ["张三", "李四"],
            ["25", "30", "35"],
            ["工程师", "教师", "医生"]
        ],
        placeholder: "请输入...",
        inlineMode: false
    },

    // 数字类型多填空题
    {
        id: "input_test_3",
        type: { typeId: 4, typeName: "input", typeDescription: "填空题" },
        title: "数学计算题",
        description: "请计算以下数学题目",
        required: true,
        blankCount: 3,
        blankLabels: ["1+1=?", "2×3=?", "10÷2=?"],
        answerType: "number",
        validators: [[], [], []],
        correctAnswers: [["2"], ["6"], ["5"]],
        placeholder: "请输入数字",
        inlineMode: false
    },

    // 行内模式填空题
    {
        id: "input_test_4",
        type: { typeId: 4, typeName: "input", typeDescription: "填空题" },
        title: "完成句子",
        description: "请在空白处填入适当的词语",
        required: true,
        blankCount: 3,
        blankLabels: ["国家", "城市", "年份"],
        answerType: "text",
        validators: [[], [], []],
        correctAnswers: [
            ["中国"],
            ["北京"],
            ["1949"]
        ],
        placeholder: "填写此处",
        inlineMode: true,
        inlineText: "{{blank}}的首都是{{blank}}，成立于{{blank}}年。"
    },

    // 混合类型填空题
    {
        id: "input_test_5",
        type: { typeId: 4, typeName: "input", typeDescription: "填空题" },
        title: "个人档案",
        description: "请完善您的个人档案信息",
        required: true,
        blankCount: 4,
        blankLabels: ["姓名", "年龄", "电子邮箱", "个人简介"],
        answerType: "text",
        correctAnswers: [[], [], [], []],
        placeholder: "请输入相关信息",
        inlineMode: false,
        multiline: [false, false, false, true],
        rows: [1, 1, 1, 4]
    },

    // 复杂行内填空题
    {
        id: "input_test_6",
        type: { typeId: 4, typeName: "input", typeDescription: "填空题" },
        title: "历史知识填空",
        description: "请填写下列历史事件的相关信息",
        required: true,
        blankCount: 4,
        blankLabels: ["人物", "地点", "时间", "事件"],
        answerType: "text",
        validators: [[], [], [], []],
        correctAnswers: [
            ["孙中山"],
            ["南京"],
            ["1912"],
            ["中华民国"]
        ],
        placeholder: "填空",
        inlineMode: true,
        inlineText: "{{blank}}先生于{{blank}}年在{{blank}}宣布成立{{blank}}。"
    }
];
