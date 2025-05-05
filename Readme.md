# Future Quiz

> Future Quiz 是一个现代化的智能问卷系统，利用人工智能技术帮助用户轻松创建、管理和分析问卷。系统集成了先进的 AI
> 能力，支持智能生成问题和深度分析问卷结果，大幅提升了问卷设计和数据分析的效率。

> 🆘 该系统旨在服务东华大学2025年软件工程实训课程,旨在探索AI在问卷领域的应用,我们给系统配备了基本的安全认证功能,但部分功能尚未完善，切勿直接用于生产环境。

#项目展示

## Logto 单点登录

- 系统集成基本的`logto`单点登录，支持在`logto`中使用邮箱登录,`github`登录等.
  ![logto1.png](img%2Flogto1.png)
- 同时使用Satoken来向前端签发`token`,具体架构如下
  ![logto2.png](img%2Flogto2.png)

## 问卷中心

- 提供基本的问卷中心管理问卷
  ![quizCenter.png](img%2FquizCenter.png)
- 支持设置问卷标题,开始与结束日期等,也支持对其进行编辑和删除
  ![quizCenter2.png](img%2FquizCenter2.png)

## MainDesign 问卷设计中心

- 支持单选,多选,填空,简答,文件上传
  ![Snipaste_2025-05-05_21-13-07.png](img%2Fquizdesign%2FSnipaste_2025-05-05_21-13-07.png)
  ![Snipaste_2025-05-05_21-13-13.png](img%2Fquizdesign%2FSnipaste_2025-05-05_21-13-13.png)
  ![Snipaste_2025-05-05_21-13-20.png](img%2Fquizdesign%2FSnipaste_2025-05-05_21-13-20.png)
  ![Snipaste_2025-05-05_21-13-28.png](img%2Fquizdesign%2FSnipaste_2025-05-05_21-13-28.png)
  ![Snipaste_2025-05-05_21-13-34.png](img%2Fquizdesign%2FSnipaste_2025-05-05_21-13-34.png)
- 提供预览组件(也是作答组件在线预览)
  ![Snipaste_2025-05-05_21-15-17.png](img%2Fquizdesign%2Fpreview%2FSnipaste_2025-05-05_21-15-17.png)
  ![Snipaste_2025-05-05_21-15-21.png](img%2Fquizdesign%2Fpreview%2FSnipaste_2025-05-05_21-15-21.png)
  ![Snipaste_2025-05-05_21-15-24.png](img%2Fquizdesign%2Fpreview%2FSnipaste_2025-05-05_21-15-24.png)
- 文件上传题支持使用`llama-index` 对pdf,doc,docx,ppt,pptx,xls,xlsx文件转换成markdown 方便AI分析
  ![Snipaste_2025-05-05_21-15-35.png](img%2Fquizdesign%2Fpreview%2FSnipaste_2025-05-05_21-15-35.png)
- 简答题支持全功能文本`markdown`编辑器
  ![b73d69f421bd1fe848b6693c91058cb2.png](img%2Fquizdesign%2Fpreview%2Fb73d69f421bd1fe848b6693c91058cb2.png)

## AI驱动的问卷生成

- 支持唤出AI面板智能生成题目
  ![Snipaste_2025-04-30_14-46-59.png](img%2Fquizdesign%2FSnipaste_2025-04-30_14-46-59.png)

## 问卷发布与作答

- 支持配置公开访问与指定人访问2种权限
  ![img.png](img%2Fquizpublish%2Fimg.png)

## 问卷广场

- 公开的问卷支持通过问卷广场直接参与调查
  ![img.png](img%2Fquizdesign%2FquizSquare%2Fimg.png)

## 问卷的回收/AI分析

- 针对至少有1份回答的问卷可在`收到的问卷`板块查看
- 支持AI对回收结果进行分析,markdown输出,mermaid公式渲染
- 对于使用llama-index处理的文件题,除了支持下载以外,还支持显示markdown内容
  ![img.png](img%2Fquizdesign%2Fdisplay%2Fimg.png)
  ![Snipaste_2025-05-05_21-23-22.png](img%2Fquizdesign%2Fdisplay%2FSnipaste_2025-05-05_21-23-22.png)
  ![Snipaste_2025-05-05_21-23-26.png](img%2Fquizdesign%2Fdisplay%2FSnipaste_2025-05-05_21-23-26.png)
  ![Snipaste_2025-05-05_21-23-34.png](img%2Fquizdesign%2Fdisplay%2FSnipaste_2025-05-05_21-23-34.png)
  ![Snipaste_2025-05-05_21-23-44.png](img%2Fquizdesign%2Fdisplay%2FSnipaste_2025-05-05_21-23-44.png)

## 问卷分析图表

- 对问卷有1个基本的分析,包括生成饼图,柱状图,词云图等
  ![Snipaste_2025-05-05_21-26-35.png](img%2Fquizdesign%2Fanalysis%2FSnipaste_2025-05-05_21-26-35.png)
  ![Snipaste_2025-05-05_21-26-46.png](img%2Fquizdesign%2Fanalysis%2FSnipaste_2025-05-05_21-26-46.png)
  ![Snipaste_2025-05-05_21-26-54.png](img%2Fquizdesign%2Fanalysis%2FSnipaste_2025-05-05_21-26-54.png)

## 问卷回答页面
![Snipaste_2025-05-05_21-40-19.png](img%2FSnipaste_2025-05-05_21-40-19.png)
![img_1.png](img%2Fimg_1.png)
## 整体架构

- 前端整体是一个工厂模式,如图
  ![img.png](img%2Fquizdesign%2Fimg.png)


## 用户头像修改

- 支持在我的账户处修改头像
  ![img.png](img%2Fimg.png)

# 构建和部署
## 前提条件
- 一个logto实例
- 一个mysql实例
- 一个minioS3实例
- Aihubmix API-KEY
## 数据库 
- 使用[full-0505.sql](src%2Fmain%2Fresources%2Fsql%2Ffull-0505.sql)创建数据库
## 启动后端
- 首先准备`application.yaml`参考:
[application.example.yaml](src%2Fmain%2Fresources%2Fapplication.example.yaml)
- 可以使用我们构建的`docker`镜像
```bash
docker run -d \
  --name futurequizbe \
  -v /path/to/your/application.yaml:/etc/featurequiz/application.yaml \
  ridiculousbuffalo/futurequizbe:latest
```
## 启动前端
```bash
docker run -d --name futurequizfe \
  -p 8080:80 \
  -e VITE_APP_LOGTO_ENDPOINT=https://logto.dev \
  -e VITE_APP_LOGTO_APPID=abc123 \
  -e VITE_APP_URL=https://myapp.example \  # 前端的域名 or url
  -e VITE_APP_API_URL=https://api.example \  # 后端的url
  -e VITE_APP_LLAMA_INDEX_BASE_URL= /api/llamaindex \ # 固定的
  -e VITE_APP_LLAMA_INDEX_KEY=sk-demo... \
  ridiculousbuffalo/futurequizfe:latest
```