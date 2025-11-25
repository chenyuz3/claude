# 🚀 快速部署指南

## 部署到 Cloudflare Pages（3分钟完成）

### 方法 1：通过 Git 部署（推荐）

1. **登录 Cloudflare**
   - 访问：https://dash.cloudflare.com/
   - 登录你的账号

2. **创建 Pages 项目**
   - 进入左侧菜单 **Workers & Pages**
   - 点击 **Create application** > **Pages** > **Connect to Git**

3. **连接仓库**
   - 授权访问 GitHub
   - 选择这个仓库
   - 选择分支：`claude/openrouter-mobile-webapp-01BVM5RgpxtxUBauh2a2VUkb`

4. **配置构建设置**
   ```
   Framework preset: None
   Build command: (留空)
   Build output directory: /
   Root Directory: (留空)
   ```

5. **部署**
   - 点击 **Save and Deploy**
   - 等待 1-2 分钟
   - 完成！🎉

6. **访问你的应用**
   - Cloudflare 会提供一个 `*.pages.dev` 域名
   - 可以在 Pages 设置中绑定自定义域名

### 方法 2：使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署
wrangler pages deploy . --project-name=openrouter-chat
```

### 方法 3：直接上传文件

1. 访问 https://pages.cloudflare.com/
2. 点击 **Create a project** > **Upload assets**
3. 选择以下文件上传：
   - `index.html`
   - `style.css`
   - `app.js`
   - `_headers`
4. 点击部署

## 首次使用配置

### 1. 获取 OpenRouter API Key

1. 访问：https://openrouter.ai/
2. 注册/登录账号
3. 进入：https://openrouter.ai/keys
4. 创建新的 API Key
5. 复制 API Key（格式：`sk-or-v1-...`）

### 2. 配置应用

1. 打开部署好的应用
2. 点击右上角设置按钮（⚙️）
3. 粘贴你的 API Key
4. 点击保存
5. 选择你想使用的模型
6. 开始聊天！

## 推荐模型配置

### 多模态/OCR 任务
- `mistralai/pixtral-large-2411` - 最佳 OCR 和图像理解

### 通用对话
- `openai/gpt-4o` - OpenAI 旗舰模型
- `anthropic/claude-3.5-sonnet` - Claude 最强推理
- `google/gemini-2.0-flash-exp:free` - 免费且快速

### 代码生成
- `anthropic/claude-3.5-sonnet` - 代码质量高
- `openai/gpt-4o` - 全能型

## 功能使用示例

### 📄 PDF OCR 解析

1. 在设置中选择模型：`mistralai/pixtral-large-2411`
2. 点击工具栏 PDF 按钮（📄）
3. 上传 PDF 文件
4. 输入："请解析这个文档的所有内容"
5. 发送

### 🖼️ 图片识别

1. 点击图片按钮（🖼️）
2. 选择图片
3. 输入："这张图片里有什么？"
4. 发送

### 🔗 URL 内容抓取

1. 点击链接按钮（🔗）
2. 输入网页 URL
3. 输入："总结这篇文章的要点"
4. 发送

### ➕ 添加自定义模型

1. 打开设置
2. 点击"添加自定义模型"
3. 输入模型 ID（从 https://openrouter.ai/models 查找）
4. 例如：`meta-llama/llama-3.3-70b-instruct`
5. 保存

## 费用说明

- 使用 OpenRouter 的按量付费
- 不同模型价格不同
- 可以在 https://openrouter.ai/models 查看各模型价格
- 建议先充值少量额度测试
- Gemini 2.0 Flash 提供免费配额

## 技巧提示

1. **移动端体验最佳**
   - 添加到主屏幕可以像原生 App 一样使用
   - iPhone：Safari > 分享 > 添加到主屏幕
   - Android：Chrome > 菜单 > 添加到主屏幕

2. **PDF 解析技巧**
   - 使用 Mistral Pixtral 模型效果最好
   - 单页 PDF 效果优于多页
   - 清晰度越高，识别越准确

3. **省钱技巧**
   - 简单任务用 Gemini 2.0 Flash (免费)
   - 复杂任务再用 GPT-4O 或 Claude
   - 避免重复发送相同内容

4. **隐私保护**
   - API Key 仅保存在你的浏览器
   - 不会发送给任何第三方
   - 清除浏览器数据会删除所有记录

## 故障排查

### 问题：API Key 无效
- 检查是否正确复制（无多余空格）
- 确认账户有余额
- 检查 Key 是否被撤销

### 问题：PDF 无法解析
- 确保选择了支持视觉的模型
- PDF 文件不要太大（建议 < 10MB）
- 尝试转换为图片再上传

### 问题：URL 抓取失败
- 部分网站有防爬虫保护
- 可以手动复制内容
- 或者让 AI 帮你访问（某些模型支持）

### 问题：移动端显示异常
- 清除浏览器缓存
- 尝试刷新页面
- 检查浏览器版本是否过旧

## 更新日志

### v1.0.0 (2025-01-XX)
- ✨ 初始版本发布
- 💬 支持 OpenRouter 多模型对话
- 🖼️ 支持多模态（图片识别）
- 📄 支持 PDF OCR 解析
- 🔗 支持 URL 内容抓取
- 📱 完美移动端适配

## 需要帮助？

- OpenRouter 文档：https://openrouter.ai/docs
- Cloudflare Pages 文档：https://developers.cloudflare.com/pages/
- 问题反馈：创建 GitHub Issue

---

祝使用愉快！🎉
