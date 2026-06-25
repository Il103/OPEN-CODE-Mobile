document.addEventListener('DOMContentLoaded', () => {
  const animations = new LiquidGlass();
  const chat = new Chat();
  const input = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const menuBtn = document.getElementById('menuBtn');
  const attachBtn = document.getElementById('attachBtn');
  const panel = document.getElementById('settings-panel');
  const panelBackdrop = document.getElementById('panelBackdrop');
  const closePanel = document.getElementById('closePanel');
  const modelSelect = document.getElementById('modelSelect');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const themeBtns = document.querySelectorAll('.theme-btn');

  animations.init();

  function adjustInputHeight() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  input.addEventListener('input', () => {
    adjustInputHeight();
    const hasText = input.value.trim().length > 0;
    sendBtn.classList.toggle('active', hasText);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  function sendMessage() {
    const text = input.value.trim();
    if (!text || chat.isProcessing) return;

    input.value = '';
    input.style.height = 'auto';
    sendBtn.classList.remove('active');

    LiquidGlass.liquidRipple(sendBtn);
    chat.sendMessage(text);
  }

  menuBtn.addEventListener('click', () => {
    panel.classList.remove('panel-hidden');
    LiquidGlass.springAnimation(panel.querySelector('.panel-glass'), {
      from: { transform: 'translateX(100%)', opacity: '0' },
      to: { transform: 'translateX(0)', opacity: '1' },
      duration: 400
    });
  });

  function closePanelHandler() {
    const panelGlass = panel.querySelector('.panel-glass');
    panelGlass.animate([
      { transform: 'translateX(0)', opacity: '1' },
      { transform: 'translateX(100%)', opacity: '0' }
    ], {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards'
    }).onfinish = () => {
      panel.classList.add('panel-hidden');
    };
  }

  closePanel.addEventListener('click', closePanelHandler);
  panelBackdrop.addEventListener('click', closePanelHandler);

  modelSelect.addEventListener('change', (e) => {
    chat.setModel(e.target.value);
  });

  apiKeyInput.addEventListener('change', (e) => {
    chat.setApiKey(e.target.value.trim());
  });

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.setAttribute('data-theme', btn.dataset.theme);
    });
  });

  attachBtn.addEventListener('click', () => {
    LiquidGlass.liquidRipple(attachBtn);
    input.focus();
  });

  const savedModel = localStorage.getItem('opencode-model');
  const savedApiKey = localStorage.getItem('opencode-api-key');
  const savedTheme = localStorage.getItem('opencode-theme');

  if (savedModel) {
    modelSelect.value = savedModel;
    chat.setModel(savedModel);
  }
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
    chat.setApiKey(savedApiKey);
  }
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.theme === savedTheme);
    });
  }

  modelSelect.addEventListener('change', () => {
    localStorage.setItem('opencode-model', modelSelect.value);
  });

  apiKeyInput.addEventListener('change', () => {
    localStorage.setItem('opencode-api-key', apiKeyInput.value.trim());
  });

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('opencode-theme', btn.dataset.theme);
    });
  });

  document.getElementById('welcome-screen').addEventListener('click', () => {
    input.focus();
  });
});
