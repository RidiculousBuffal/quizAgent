// 模拟后端 JSON 数据
export const mockQuestionsJSON = [
    {
        id: "input_test_1",
        type: { typeId: 4, typeName: "input", typeDescription: "填空题" },
        title: "基础文本输入",
        description: "请输入您的姓名",
        placeholder: "请在此输入...",
        required: true,
        maxLength: 50
    },
    {
        id: "input_test_2",
        type: { typeId: 4, typeName: "input", typeDescription: "填空题" },
        title: "数字输入",
        description: "请输入您的年龄",
        placeholder: "例如：25",
        inputType: "number",
        required: true,
        min: 18,
        max: 120
    },
    {
        id: "input_test_3",
        type: { typeId: 4, typeName: "input", typeDescription: "填空题" },
        title: "邮箱输入",
        description: "请输入您的电子邮箱地址",
        placeholder: "example@domain.com",
        inputType: "email",
        required: true,
        validation: "email"
    },
    {
        id: "input_test_4",
        type: { typeId: 4, typeName: "input", typeDescription: "填空题" },
        title: "密码输入",
        description: "请设置一个安全密码",
        placeholder: "至少8位字符",
        inputType: "password",
        required: true,
        minLength: 8,
        validation: "password"
    },
    {
        id: "input_test_5",
        type: { typeId: 4, typeName: "input", typeDescription: "多选题" },
        title: "多行文本输入",
        description: "请简要描述您的个人情况",
        placeholder: "请在此输入您的个人简介...",
        multiline: true,
        rows: 4,
        maxLength: 500
    }
];
