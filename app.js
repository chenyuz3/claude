// 应用状态
const state = {
    apiKey: localStorage.getItem('openrouter_api_key') || '',
    currentModel: localStorage.getItem('openrouter_model') || 'openai/gpt-4o',
    messages: [],
    attachments: [],
    customModels: JSON.parse(localStorage.getItem('custom_models') || '[]')
};

// DOM 元素
const elements = {
    chatContainer: document.getElementById('chatContainer'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    settingsPanel: document.getElementById('settingsPanel'),
    closeSettings: document.getElementById('closeSettings'),
    apiKeyInput: document.getElementById('apiKey'),
    saveApiKey: document.getElementById('saveApiKey'),
    modelSelect: document.getElementById('modelSelect'),
    addCustomModel: document.getElementById('addCustomModel'),
    customModelForm: document.getElementById('customModelForm'),
    customModelId: document.getElementById('customModelId'),
    saveCustomModel: document.getElementById('saveCustomModel'),
    imageBtn: document.getElementById('imageBtn'),
    pdfBtn: document.getElementById('pdfBtn'),
    urlBtn: document.getElementById('urlBtn'),
    clearBtn: document.getElementById('clearBtn'),
    imageInput: document.getElementById('imageInput'),
    pdfInput: document.getElementById('pdfInput'),
    attachments: document.getElementById('attachments'),
    urlModal: document.getElementById('urlModal'),
    urlInput: document.getElementById('urlInput'),
    urlOk: document.getElementById('urlOk'),
    urlCancel: document.getElementById('urlCancel')
};

// 初始化
function init() {
    // 加载保存的 API Key
    if (state.apiKey) {
        elements.apiKeyInput.value = state.apiKey;
    }

    // 加载自定义模型
    loadCustomModels();

    // 设置当前模型
    elements.modelSelect.value = state.currentModel;

    // 绑定事件
    bindEvents();

    // 调整输入框高度
    autoResizeTextarea();
}

// 绑定事件
function bindEvents() {
    elements.settingsBtn.addEventListener('click', () => {
        elements.settingsPanel.classList.add('active');
    });

    elements.closeSettings.addEventListener('click', () => {
        elements.settingsPanel.classList.remove('active');
    });

    elements.saveApiKey.addEventListener('click', () => {
        state.apiKey = elements.apiKeyInput.value.trim();
        localStorage.setItem('openrouter_api_key', state.apiKey);
        showNotification('API Key 已保存');
    });

    elements.modelSelect.addEventListener('change', (e) => {
        state.currentModel = e.target.value;
        localStorage.setItem('openrouter_model', state.currentModel);
    });

    elements.addCustomModel.addEventListener('click', () => {
        elements.customModelForm.style.display =
            elements.customModelForm.style.display === 'none' ? 'block' : 'none';
    });

    elements.saveCustomModel.addEventListener('click', () => {
        const modelId = elements.customModelId.value.trim();
        if (modelId) {
            state.customModels.push(modelId);
            localStorage.setItem('custom_models', JSON.stringify(state.customModels));
            loadCustomModels();
            elements.customModelId.value = '';
            elements.customModelForm.style.display = 'none';
            showNotification('模型已添加');
        }
    });

    elements.sendBtn.addEventListener('click', sendMessage);

    elements.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    elements.messageInput.addEventListener('input', autoResizeTextarea);

    elements.imageBtn.addEventListener('click', () => {
        elements.imageInput.click();
    });

    elements.pdfBtn.addEventListener('click', () => {
        elements.pdfInput.click();
    });

    elements.urlBtn.addEventListener('click', () => {
        elements.urlModal.classList.add('active');
        elements.urlInput.focus();
    });

    elements.urlOk.addEventListener('click', async () => {
        const url = elements.urlInput.value.trim();
        if (url) {
            await fetchUrlContent(url);
            elements.urlModal.classList.remove('active');
            elements.urlInput.value = '';
        }
    });

    elements.urlCancel.addEventListener('click', () => {
        elements.urlModal.classList.remove('active');
        elements.urlInput.value = '';
    });

    elements.clearBtn.addEventListener('click', () => {
        if (confirm('确定要清空对话吗？')) {
            state.messages = [];
            renderMessages();
        }
    });

    elements.imageInput.addEventListener('change', handleImageUpload);
    elements.pdfInput.addEventListener('change', handlePdfUpload);
}

// 加载自定义模型
function loadCustomModels() {
    // 清除之前的自定义选项
    const options = Array.from(elements.modelSelect.options);
    options.forEach(opt => {
        if (opt.dataset.custom) {
            opt.remove();
        }
    });

    // 添加自定义模型
    state.customModels.forEach(modelId => {
        const option = document.createElement('option');
        option.value = modelId;
        option.textContent = modelId;
        option.dataset.custom = 'true';
        elements.modelSelect.appendChild(option);
    });
}

// 自动调整输入框高度
function autoResizeTextarea() {
    const textarea = elements.messageInput;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// 处理图片上传
async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const base64 = event.target.result;
        state.attachments.push({
            type: 'image',
            data: base64,
            name: file.name
        });
        renderAttachments();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

// 处理 PDF 上传
async function handlePdfUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const base64 = event.target.result;
        state.attachments.push({
            type: 'pdf',
            data: base64,
            name: file.name
        });
        renderAttachments();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

// 抓取 URL 内容
async function fetchUrlContent(url) {
    try {
        showNotification('正在抓取 URL 内容...');

        // 使用 CORS 代理或直接抓取
        const response = await fetch(url);
        const html = await response.text();

        // 简单提取文本内容
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const text = doc.body.innerText || doc.body.textContent;

        state.attachments.push({
            type: 'url',
            data: text.substring(0, 4000), // 限制长度
            url: url,
            name: url
        });
        renderAttachments();
        showNotification('URL 内容已添加');
    } catch (error) {
        console.error('抓取 URL 失败:', error);
        showNotification('抓取 URL 失败，将使用 AI 帮助抓取');

        // 使用 AI 抓取
        state.attachments.push({
            type: 'url_ai',
            url: url,
            name: url
        });
        renderAttachments();
    }
}

// 渲染附件
function renderAttachments() {
    elements.attachments.innerHTML = '';

    state.attachments.forEach((attachment, index) => {
        const item = document.createElement('div');
        item.className = 'attachment-item';

        if (attachment.type === 'image') {
            const img = document.createElement('img');
            img.className = 'attachment-preview';
            img.src = attachment.data;
            item.appendChild(img);
        } else if (attachment.type === 'pdf') {
            const pdf = document.createElement('div');
            pdf.className = 'attachment-pdf';
            pdf.textContent = '📄';
            item.appendChild(pdf);
        } else if (attachment.type === 'url' || attachment.type === 'url_ai') {
            const urlDiv = document.createElement('div');
            urlDiv.className = 'attachment-url';
            urlDiv.textContent = '🔗 ' + attachment.name;
            item.appendChild(urlDiv);
        }

        const removeBtn = document.createElement('button');
        removeBtn.className = 'attachment-remove';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => {
            state.attachments.splice(index, 1);
            renderAttachments();
        };
        item.appendChild(removeBtn);

        elements.attachments.appendChild(item);
    });
}

// 发送消息
async function sendMessage() {
    const text = elements.messageInput.value.trim();
    if (!text && state.attachments.length === 0) return;

    if (!state.apiKey) {
        showNotification('请先设置 API Key');
        elements.settingsPanel.classList.add('active');
        return;
    }

    // 构建消息内容
    const messageContent = [];

    // 添加文本
    if (text) {
        messageContent.push({
            type: 'text',
            text: text
        });
    }

    // 处理附件
    for (const attachment of state.attachments) {
        if (attachment.type === 'image') {
            messageContent.push({
                type: 'image_url',
                image_url: {
                    url: attachment.data
                }
            });
        } else if (attachment.type === 'pdf') {
            // PDF OCR - 使用 Mistral 模型处理
            messageContent.push({
                type: 'image_url',
                image_url: {
                    url: attachment.data
                }
            });

            // 添加 OCR 提示
            if (!text.toLowerCase().includes('ocr') && !text.toLowerCase().includes('解析')) {
                messageContent.unshift({
                    type: 'text',
                    text: '请解析这个 PDF 文档的内容。' + (text ? '\n\n' + text : '')
                });
            }
        } else if (attachment.type === 'url') {
            messageContent.push({
                type: 'text',
                text: `\n\n[URL 内容: ${attachment.url}]\n${attachment.data}`
            });
        } else if (attachment.type === 'url_ai') {
            messageContent.push({
                type: 'text',
                text: `\n\n请帮我抓取并总结这个网页的内容: ${attachment.url}`
            });
        }
    }

    // 添加用户消息
    const userMessage = {
        role: 'user',
        content: messageContent
    };

    state.messages.push(userMessage);

    // 清空输入
    elements.messageInput.value = '';
    state.attachments = [];
    renderAttachments();
    autoResizeTextarea();

    // 渲染消息
    renderMessages();

    // 显示加载状态
    showTypingIndicator();

    // 调用 API
    try {
        const response = await callOpenRouter(state.messages);

        // 添加助手消息
        state.messages.push({
            role: 'assistant',
            content: response
        });

        hideTypingIndicator();
        renderMessages();
    } catch (error) {
        hideTypingIndicator();
        showError(error.message);
    }
}

// 调用 OpenRouter API
async function callOpenRouter(messages) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${state.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'OpenRouter Chat App'
        },
        body: JSON.stringify({
            model: state.currentModel,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '请求失败');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// 渲染消息
function renderMessages() {
    // 清除欢迎消息
    const welcome = elements.chatContainer.querySelector('.welcome-message');
    if (welcome) {
        welcome.remove();
    }

    // 清除现有消息（保留加载指示器）
    const messages = elements.chatContainer.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());

    // 渲染所有消息
    state.messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}`;

        const label = document.createElement('div');
        label.className = 'message-label';
        label.textContent = message.role === 'user' ? '你' : 'AI';
        messageDiv.appendChild(label);

        const content = document.createElement('div');
        content.className = 'message-content';

        // 处理内容
        if (Array.isArray(message.content)) {
            message.content.forEach(item => {
                if (item.type === 'text') {
                    const textDiv = document.createElement('div');
                    textDiv.textContent = item.text;
                    content.appendChild(textDiv);
                } else if (item.type === 'image_url') {
                    const img = document.createElement('img');
                    img.className = 'message-image';
                    img.src = item.image_url.url;
                    content.appendChild(img);
                }
            });
        } else {
            content.textContent = message.content;
        }

        messageDiv.appendChild(content);
        elements.chatContainer.appendChild(messageDiv);
    });

    // 滚动到底部
    scrollToBottom();
}

// 显示加载指示器
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message assistant';
    indicator.id = 'typing-indicator';

    const label = document.createElement('div');
    label.className = 'message-label';
    label.textContent = 'AI';
    indicator.appendChild(label);

    const typing = document.createElement('div');
    typing.className = 'message-content';
    typing.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    indicator.appendChild(typing);

    elements.chatContainer.appendChild(indicator);
    scrollToBottom();
}

// 隐藏加载指示器
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// 显示错误
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = '错误: ' + message;
    elements.chatContainer.appendChild(errorDiv);
    scrollToBottom();

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// 显示通知
function showNotification(message) {
    // 简单的通知实现
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: #1e293b;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// 滚动到底部
function scrollToBottom() {
    setTimeout(() => {
        elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
    }, 100);
}

// 启动应用
init();
