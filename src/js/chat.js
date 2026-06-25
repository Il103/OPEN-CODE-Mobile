class ChatManager {
  constructor() {
    this.messages = [];
    this.isProcessing = false;
    this.container = document.getElementById('messages');
    this.typingIndicator = document.getElementById('typing-indicator');
    this.welcomeScreen = document.getElementById('welcome-screen');
    this.currentModel = 'gpt-4';
    this.apiKey = '';
  }

  setModel(model) {
    this.currentModel = model;
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  async sendMessage(text) {
    if (this.isProcessing || !text.trim()) return;

    this.isProcessing = true;
    this.hideWelcome();

    const userMsg = this.addMessage(text, 'user');
    this.showTyping();

    try {
      const response = await this.getAIResponse(text);
      this.hideTyping();
      const aiMsg = this.addMessage(response, 'ai');
      this.animateMessageContent(aiMsg, response);
    } catch (error) {
      this.hideTyping();
      this.addMessage(`Error: ${error.message}`, 'ai error');
    }

    this.isProcessing = false;
  }

  addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';

    if (type === 'ai' && !text.startsWith('Error')) {
      textDiv.textContent = '';
    } else {
      textDiv.textContent = text;
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

    return msgDiv;
  }

  async animateMessageContent(msgElement, text) {
    const textDiv = msgElement.querySelector('.message-text');
    const formattedText = this.formatText(text);
    textDiv.innerHTML = '';

    const renderContainer = document.createElement('div');
    renderContainer.innerHTML = formattedText;
    textDiv.appendChild(renderContainer);

    LiquidGlass.animateMessage(msgElement, false);

    const codeBlocks = textDiv.querySelectorAll('.message-code');
    codeBlocks.forEach(block => {
      block.style.animation = 'code-fade-in 0.3s ease forwards';
    });

    const lines = textDiv.querySelectorAll('p, li, div');
    lines.forEach((line, i) => {
      line.style.animation = `slide-up 0.3s ease forwards`;
      line.style.animationDelay = `${i * 0.05}s`;
      line.style.opacity = '0';
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
          html += `<div class="message-code">`;
          html += `<div class="code-header"><span class="code-lang">${codeLang || 'code'}</span><button class="copy-btn" onclick="Chat.copyCode(this)">Copy</button></div>`;
          html += `<pre><code>${this.escapeHtml(codeContent.trim())}</code></pre></div>`;
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
        const text = line.replace(/^#{1,3}\s/, '');
        const tag = `h${Math.min(level + 2, 5)}`;
        html += `<${tag} style="font-weight:600;margin:8px 0 4px;font-size:${level === 1 ? '16' : level === 2 ? '15' : '14'}px">${text}</${tag}>`;
      } else if (line.match(/^- /)) {
        html += `<li style="margin-left:16px;opacity:0.9">${line.replace(/^- /, '')}</li>`;
      } else if (line.match(/^\d+\. /)) {
        html += `<li style="margin-left:16px;opacity:0.9">${line.replace(/^\d+\. /, '')}</li>`;
      } else if (line.match(/\*\*(.+?)\*\*/)) {
        html += `<p>${this.parseInline(line)}</p>`;
      } else {
        html += `<p>${this.parseInline(line)}</p>`;
      }
    }

    if (inCode) {
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
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showTyping() {
    this.typingIndicator.classList.remove('typing-hidden');
    this.typingIndicator.classList.add('typing-visible');
    this.typingIndicator.querySelector('.typing-dots').classList.add('typing-active');
    this.scrollToBottom();
  }

  hideTyping() {
    this.typingIndicator.classList.remove('typing-visible');
    this.typingIndicator.classList.add('typing-hidden');
    this.typingIndicator.querySelector('.typing-dots').classList.remove('typing-active');
  }

  hideWelcome() {
    if (this.welcomeScreen) {
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
      btn.addEventListener('click', () => this.copyCode(btn));
    });
  }

  copyCode(btn) {
    const codeBlock = btn.closest('.message-code');
    const code = codeBlock.querySelector('code');
    if (code) {
      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    }
  }

  async getAIResponse(text) {
    const providers = {
      'gpt-4': 'https://api.openai.com/v1/chat/completions',
      'gpt-3.5': 'https://api.openai.com/v1/chat/completions',
      'claude-3': 'https://api.anthropic.com/v1/messages',
      'gemini': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    };

    const url = providers[this.currentModel] || providers['gpt-4'];

    if (!this.apiKey) {
      return this.getDemoResponse(text);
    }

    const context = this.messages.slice(-6).map(m => ({
      role: m.type === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    context.push({ role: 'user', content: text });

    try {
      let body, headers;

      if (this.currentModel.startsWith('claude')) {
        headers = {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        };
        body = JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4096,
          messages: context
        });
      } else if (this.currentModel.startsWith('gemini')) {
        url.replace('?key=', `?key=${this.apiKey}`);
        headers = { 'Content-Type': 'application/json' };
        body = JSON.stringify({
          contents: [{ parts: [{ text }] }]
        });
      } else {
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        };
        body = JSON.stringify({
          model: this.currentModel,
          messages: context,
          max_tokens: 4096
        });
      }

      const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (this.currentModel.startsWith('claude')) {
        return data.content[0].text;
      } else if (this.currentModel.startsWith('gemini')) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return data.choices[0].message.content;
      }
    } catch (e) {
      console.warn('API call failed, using demo mode:', e.message);
      return this.getDemoResponse(text);
    }
  }

  getDemoResponse(text) {
    const responses = {
      'hello': 'Hello! I\'m OPEN CODE Mobile. How can I help you code today?',
      'hi': 'Hey there! Ready to write some code together?',
      'code': 'Here\'s an example:\n\n```python\ndef hello():\n    print("Hello from OPEN CODE Mobile!")\n\nhello()\n```\n\nTry it out!',
      'help': 'I can help you with:\n- Writing code\n- Debugging\n- Explaining concepts\n- Code reviews\n- And more!\n\nJust ask me anything!'
    };

    const lowerText = text.toLowerCase().trim();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerText.includes(key)) {
        return response;
      }
    }

    return `Great question about "${text}"! I'm OPEN CODE Mobile, your AI coding assistant running on Liquid Glass.\n\nI can help you with:\n\n- **Code generation** in any language\n- **Debugging** and fixing errors\n- **Explaining** complex concepts\n- **Refactoring** and optimization\n- **Testing** and best practices\n\nWhat specific help do you need?`;
  }
}

window.Chat = ChatManager;
