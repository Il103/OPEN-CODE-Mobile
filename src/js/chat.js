class ChatManager {
  constructor() {
    this.messages = [];
    this.isProcessing = false;
    this.container = document.getElementById('messages');
    this.typingIndicator = document.getElementById('typing-indicator');
    this.welcomeScreen = document.getElementById('welcome-screen');
    this.currentModel = 'gemini-2.0-flash';
    this.modelName = 'Gemini 2.0 Flash';
    this.apiKeys = {};
  }

  setModel(modelId) {
    this.currentModel = modelId;
    const allModels = [...OPENCODE_MODELS.free, ...OPENCODE_MODELS.premium];
    const model = allModels.find(m => m.id === modelId);
    if (model) {
      this.modelName = model.name;
      document.getElementById('currentModelBadge').textContent = model.name;
    }
  }

  setApiKey(provider, key) {
    this.apiKeys[provider] = key;
  }

  getModelInfo() {
    const allModels = [...OPENCODE_MODELS.free, ...OPENCODE_MODELS.premium];
    return allModels.find(m => m.id === this.currentModel);
  }

  async sendMessage(text) {
    if (this.isProcessing || !text.trim()) return;

    this.isProcessing = true;
    this.hideWelcome();

    this.addMessage(text, 'user');
    this.showTyping();

    try {
      const response = await this.getAIResponse(text);
      this.hideTyping();
      this.addMessage(response, 'ai');
    } catch (error) {
      this.hideTyping();
      this.addMessage(`**Error:** ${error.message}`, 'ai error');
    }

    this.isProcessing = false;
  }

  addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';

    if (type === 'ai' && !text.startsWith('**Error')) {
      textDiv.innerHTML = '';
    } else {
      textDiv.innerHTML = this.formatText(text);
    }

    msgDiv.appendChild(textDiv);

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msgDiv.appendChild(time);

    this.container.appendChild(msgDiv);

    if (type !== 'ai') {
      LiquidGlass.animateMessage(msgDiv, type === 'user');
    }

    this.scrollToBottom();
    this.messages.push({ text, type, element: msgDiv });

    if (type === 'ai') {
      this.animateAIMessage(msgDiv, text);
    }

    return msgDiv;
  }

  animateAIMessage(msgElement, text) {
    const textDiv = msgElement.querySelector('.message-text');
    const formattedHTML = this.formatText(text);
    textDiv.innerHTML = '';

    const renderContainer = document.createElement('div');
    renderContainer.innerHTML = formattedHTML;
    textDiv.appendChild(renderContainer);

    LiquidGlass.animateMessage(msgElement, false);

    const elements = textDiv.querySelectorAll('p, li, div, pre');
    elements.forEach((el, i) => {
      el.style.animation = `slide-up 0.35s ease forwards`;
      el.style.animationDelay = `${i * 0.06}s`;
      el.style.opacity = '0';
    });

    this.scrollToBottom();
    this.setupCopyButtons(textDiv);
  }

  formatText(text) {
    let html = '';
    const lines = text.split('\n');
    let inCode = false;
    let codeContent = '';
    let codeLang = '';

    for (const line of lines) {
      const codeMatch = line.match(/^```(\w*)/);

      if (codeMatch) {
        if (inCode) {
          html += `<div class="message-code"><div class="code-header"><span class="code-lang">${codeLang || 'code'}</span><button class="copy-btn">Copy</button></div><pre><code>${this.escapeHtml(codeContent.trim())}</code></pre></div>`;
          codeContent = '';
          codeLang = '';
          inCode = false;
        } else {
          inCode = true;
          codeLang = codeMatch[1];
        }
        continue;
      }

      if (inCode) {
        codeContent += line + '\n';
        continue;
      }

      if (line.trim() === '') {
        html += '<br>';
        continue;
      }

      if (line.match(/^#{1,3}\s/)) {
        const level = line.match(/^#{1,3}/)[0].length;
        const t = line.replace(/^#{1,3}\s/, '');
        html += `<h${Math.min(level + 2, 5)} style="font-weight:600;margin:8px 0 4px;font-size:${level === 1 ? '16' : level === 2 ? '15' : '14'}px">${this.parseInline(t)}</h${Math.min(level + 2, 5)}>`;
      } else if (line.match(/^- /)) {
        html += `<li style="margin-left:16px;opacity:0.9">${this.parseInline(line.replace(/^- /, ''))}</li>`;
      } else if (line.match(/^\d+\. /)) {
        html += `<li style="margin-left:16px;opacity:0.9">${this.parseInline(line.replace(/^\d+\. /, ''))}</li>`;
      } else {
        html += `<p>${this.parseInline(line)}</p>`;
      }
    }

    if (inCode && codeContent.trim()) {
      html += `<div class="message-code"><pre><code>${this.escapeHtml(codeContent.trim())}</code></pre></div>`;
    }

    return html;
  }

  parseInline(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.06);padding:1px 6px;border-radius:4px;font-size:13px">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--accent-2);text-decoration:none">$1</a>');
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  showTyping() {
    this.typingIndicator.classList.remove('typing-hidden');
    this.typingIndicator.classList.add('typing-visible');
    this.typingIndicator.querySelector('.typing-dots').classList.add('typing-active');
    document.getElementById('typingText').textContent = `${this.modelName} is thinking...`;
    this.scrollToBottom();
  }

  hideTyping() {
    this.typingIndicator.classList.remove('typing-visible');
    this.typingIndicator.classList.add('typing-hidden');
    this.typingIndicator.querySelector('.typing-dots').classList.remove('typing-active');
  }

  hideWelcome() {
    if (this.welcomeScreen && this.welcomeScreen.style.display !== 'none') {
      this.welcomeScreen.style.display = 'none';
    }
  }

  scrollToBottom() {
    const container = document.getElementById('chat-container');
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }

  setupCopyButtons(container) {
    container.querySelectorAll('.copy-btn').forEach(btn => {
      btn.removeEventListener('click', btn._handler);
      btn._handler = () => this.copyCode(btn);
      btn.addEventListener('click', btn._handler);
    });
  }

  copyCode(btn) {
    const codeBlock = btn.closest('.message-code');
    const code = codeBlock?.querySelector('code');
    if (code) {
      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    }
  }

  async getAIResponse(text) {
    const modelInfo = this.getModelInfo();
    if (!modelInfo) throw new Error('Model not found');

    const keyProvider = modelInfo.keyRequired;
    const apiKey = this.apiKeys[keyProvider];

    if (!apiKey) {
      throw new Error(`API key required for ${modelInfo.provider}. Add it in Settings.`);
    }

    const context = this.messages.slice(-8).map(m => ({
      role: m.type === 'user' ? 'user' : 'assistant',
      content: m.text
    }));
    context.push({ role: 'user', content: text });

    try {
      if (keyProvider === 'openai') {
        return await this.callOpenAI(apiKey, context);
      } else if (keyProvider === 'anthropic') {
        return await this.callAnthropic(apiKey, context);
      } else if (keyProvider === 'gemini') {
        return await this.callGemini(apiKey, context);
      }
      throw new Error('Unknown provider');
    } catch (e) {
      console.error('API error:', e);
      throw new Error(`${modelInfo.provider}: ${e.message}`);
    }
  }

  async callOpenAI(apiKey, messages) {
    const modelMap = {
      'gpt-4o': 'gpt-4o',
      'gpt-4-turbo': 'gpt-4-turbo',
      'gpt-4': 'gpt-4',
      'gpt-4o-mini': 'gpt-4o-mini',
      'gpt-3.5': 'gpt-3.5-turbo'
    };

    const model = modelMap[this.currentModel] || 'gpt-4o-mini';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        max_tokens: 4096,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`HTTP ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callAnthropic(apiKey, messages) {
    const modelMap = {
      'claude-3.5-sonnet': 'claude-3-5-sonnet-20241022',
      'claude-3-opus': 'claude-3-opus-20240229',
      'claude-3-haiku': 'claude-3-haiku-20240307'
    };

    const model = modelMap[this.currentModel] || 'claude-3-haiku-20240307';

    const systemMsgs = messages.filter(m => m.role === 'system');
    const userMsgs = messages.filter(m => m.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: systemMsgs.map(m => m.content).join('\n') || undefined,
        messages: userMsgs.map(m => ({ role: m.role, content: m.content }))
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`HTTP ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async callGemini(apiKey, messages) {
    const modelMap = {
      'gemini-2.0-flash': 'gemini-2.0-flash',
      'gemini-2.0-flash-lite': 'gemini-2.0-flash-lite',
      'gemini-2.0-pro': 'gemini-2.0-pro',
      'gemini-2.0-ultra': 'gemini-2.0-ultra'
    };

    const model = modelMap[this.currentModel] || 'gemini-2.0-flash';

    const lastUserMsg = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMsg) throw new Error('No user message');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: lastUserMsg.content }]
          }],
          generationConfig: {
            maxOutputTokens: 4096,
            temperature: 0.7
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`HTTP ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
  }
}

window.Chat = ChatManager;
