# OpenRouter Chat - 移动端 Web App

一个功能强大的移动端适配的 OpenRouter 聊天应用，支持多模态对话、PDF OCR 解析和 URL 内容抓取。

## ✨ 功能特性

- 🎨 **移动端优先设计** - 完美适配手机浏览器
- 💬 **多模型支持** - 支持 OpenRouter 上的所有模型
- 🖼️ **多模态对话** - 支持图片上传和视觉理解
- 📄 **PDF OCR 解析** - 使用 Mistral Pixtral 进行 PDF 文档解析
- 🔗 **URL 内容抓取** - 自动抓取和总结网页内容
- ⚙️ **自定义模型** - 可以添加任意 OpenRouter 模型
- 💾 **本地存储** - API Key 和设置保存在浏览器本地

## 🚀 部署到 Cloudflare Pages

### 方式一：使用 Git 仓库部署（推荐）

1. **将代码推送到 GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **在 Cloudflare Pages 创建项目**

   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 **Pages** > **Create a project**
   - 选择 **Connect to Git**
   - 授权并选择你的 GitHub 仓库
   - 配置构建设置：
     - **Framework preset**: None
     - **Build command**: (留空)
     - **Build output directory**: `/`
   - 点击 **Save and Deploy**

3. **等待部署完成**

   几分钟后，你的应用就会上线！

### 方式二：使用 Wrangler CLI 部署

1. **安装 Wrangler**

   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**

   ```bash
   wrangler login
   ```

3. **部署项目**

   ```bash
   wrangler pages deploy . --project-name=openrouter-chat
   ```

### 方式三：直接上传文件

1. 访问 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 点击 **Create a project** > **Direct Upload**
3. 将以下文件打包成 ZIP：
   - `index.html`
   - `style.css`
   - `app.js`
   - `_headers`
4. 上传 ZIP 文件并部署

## 📱 使用指南

### 首次使用

1. **设置 API Key**
   - 点击右上角的设置按钮（⚙️）
   - 输入你的 [OpenRouter API Key](https://openrouter.ai/keys)
   - 点击保存

2. **选择模型**
   - 在设置中选择你想使用的模型
   - 预设了常用模型：GPT-4O, Claude 3.5 Sonnet, Gemini 等

### 基本对话

直接在输入框中输入消息，点击发送即可开始对话。

### 图片识别（多模态）

1. 点击工具栏中的图片按钮（🖼️）
2. 选择要上传的图片
3. 输入你的问题或指令
4. 发送消息

### PDF OCR 解析

1. 点击工具栏中的 PDF 按钮（📄）
2. 选择 PDF 文件
3. 应用会自动使用支持视觉的模型（如 Mistral Pixtral）进行解析
4. 输入你想了解的内容或直接发送

**注意**：为了获得最佳 OCR 效果，建议选择 `mistralai/pixtral-large-2411` 模型。

### URL 内容抓取

1. 点击工具栏中的链接按钮（🔗）
2. 输入要抓取的 URL
3. 应用会尝试获取网页内容
4. 输入你的问题，AI 会基于抓取的内容回答

### 添加自定义模型

1. 进入设置
2. 点击"添加自定义模型"
3. 输入模型 ID（例如：`anthropic/claude-3-opus`）
4. 保存后即可在模型列表中选择

可用的模型列表可以在 [OpenRouter Models](https://openrouter.ai/models) 查看。

## 🛠️ 技术栈

- **前端**: 纯 HTML5/CSS3/JavaScript（无框架）
- **API**: OpenRouter API
- **部署**: Cloudflare Pages
- **存储**: LocalStorage

## 📋 支持的模型示例

- OpenAI GPT-4O / GPT-4 Turbo
- Anthropic Claude 3.5 Sonnet / Opus
- Google Gemini 2.0 Flash
- Mistral Pixtral Large (支持视觉/OCR)
- Meta Llama 3.3 70B
- Qwen 2.5 72B
- 以及 OpenRouter 上的所有其他模型

## 🔒 隐私和安全

- API Key 仅保存在浏览器本地（LocalStorage）
- 不会发送到除 OpenRouter 外的任何服务器
- 所有对话数据仅保存在浏览器中
- 清除浏览器数据会删除所有本地信息

## 💡 提示和技巧

1. **切换模型**：不同模型有不同的优势
   - GPT-4O: 综合能力强，适合复杂任务
   - Claude 3.5 Sonnet: 推理能力强，适合分析
   - Gemini 2.0: 速度快，适合快速对话
   - Pixtral Large: 视觉能力强，适合 OCR 和图像分析

2. **PDF 解析**：上传 PDF 时，建议：
   - 使用 Mistral Pixtral 模型
   - 提供具体的问题或指令
   - 一次上传一个文件效果最佳

3. **URL 抓取**：如果自动抓取失败，可以：
   - 手动复制网页内容粘贴到对话中
   - 使用支持工具调用的模型

4. **移动端优化**：
   - 支持触摸操作
   - 自适应输入法键盘
   - 优化的滚动性能

## 🆘 常见问题

**Q: 为什么提示 API Key 错误？**

A: 请确保：
- API Key 正确复制（无多余空格）
- 账户有足够的额度
- 访问 [OpenRouter Dashboard](https://openrouter.ai/) 检查状态

**Q: PDF OCR 效果不好怎么办？**

A: 建议：
- 确保选择了支持视觉的模型（如 Pixtral Large）
- PDF 质量较好，文字清晰
- 提供更具体的解析指令

**Q: URL 抓取失败怎么办？**

A: 由于浏览器 CORS 限制，某些网站无法直接抓取。可以：
- 手动复制内容粘贴
- 使用 AI 的网页抓取能力（某些模型支持）

**Q: 如何清空对话？**

A: 点击工具栏中的垃圾桶按钮（🗑️）。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🔗 相关链接

- [OpenRouter 官网](https://openrouter.ai/)
- [OpenRouter API 文档](https://openrouter.ai/docs)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
