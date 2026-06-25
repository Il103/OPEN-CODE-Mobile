document.addEventListener('DOMContentLoaded', () => {
  const animations = new LiquidGlass();
  const chat = new Chat();
  let currentUser = null;

  animations.init();
  renderModels();

  // ===== AUTH =====
  function checkAuth() {
    const saved = localStorage.getItem('opencode-user');
    if (saved) {
      currentUser = JSON.parse(saved);
      showMainApp();
    } else {
      document.getElementById('auth-screen').classList.add('active');
    }
  }

  function showMainApp() {
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('main-app').classList.add('active');
    document.getElementById('tab-bar').classList.remove('tab-bar-hidden');
    document.getElementById('tab-bar').classList.add('tab-bar-visible');

    const name = currentUser?.name || 'User';
    const email = currentUser?.email || 'user@opencode.app';
    const initial = name.charAt(0).toUpperCase();

    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = email;
    document.getElementById('profileNameLg').textContent = name;
    document.getElementById('profileEmailLg').textContent = email;
    document.getElementById('profileAvatar').textContent = initial;
    document.getElementById('profileAvatarLg').textContent = initial;
  }

  // Auth tabs
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
      document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
    });
  });

  // Sign In
  document.getElementById('signin-btn').addEventListener('click', () => {
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value.trim();
    if (email && password) {
      currentUser = { name: email.split('@')[0], email };
      localStorage.setItem('opencode-user', JSON.stringify(currentUser));
      showMainApp();
    }
  });

  // Sign Up
  document.getElementById('signup-btn').addEventListener('click', () => {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    if (name && email && password) {
      currentUser = { name, email };
      localStorage.setItem('opencode-user', JSON.stringify(currentUser));
      showMainApp();
    }
  });

  // Google Sign In
  document.querySelectorAll('#googleSignIn, #googleSignUp').forEach(btn => {
    btn.addEventListener('click', () => {
      currentUser = { name: 'Google User', email: 'user@gmail.com' };
      localStorage.setItem('opencode-user', JSON.stringify(currentUser));
      showMainApp();
    });
  });

  // Sign Out
  document.querySelectorAll('#signOutBtn, #signOutPanelBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('opencode-user');
      currentUser = null;
      document.getElementById('main-app').classList.remove('active');
      document.getElementById('tab-bar').classList.remove('tab-bar-visible');
      document.getElementById('tab-bar').classList.add('tab-bar-hidden');
      document.getElementById('auth-screen').classList.add('active');
      document.getElementById('profile-panel').classList.add('panel-hidden');
      chat.messages = [];
      document.getElementById('messages').innerHTML = '';
      document.getElementById('welcome-screen').style.display = '';
    });
  });

  // ===== TAB NAVIGATION =====
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(`${btn.dataset.tab}-screen`).classList.add('active');
    });
  });

  // ===== CHAT INPUT =====
  const input = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');

  function adjustInputHeight() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  input.addEventListener('input', () => {
    adjustInputHeight();
    sendBtn.classList.toggle('active', input.value.trim().length > 0);
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

  // Suggestion chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.text;
      input.dispatchEvent(new Event('input'));
      sendMessage();
    });
  });

  // ===== PROFILE PANEL =====
  document.getElementById('profileBtn').addEventListener('click', () => {
    document.getElementById('profile-panel').classList.remove('panel-hidden');
  });

  document.getElementById('closeProfile').addEventListener('click', closeProfile);
  document.getElementById('profileBackdrop').addEventListener('click', closeProfile);

  function closeProfile() {
    document.getElementById('profile-panel').classList.add('panel-hidden');
  }

  // ===== SETTINGS: API KEYS =====
  function loadSettings() {
    const keys = ['openai', 'anthropic', 'gemini'];
    keys.forEach(k => {
      const saved = localStorage.getItem(`opencode-key-${k}`);
      if (saved) {
        document.getElementById(`${k}Key`).value = saved;
        chat.setApiKey(k, saved);
      }
    });

    const savedModel = localStorage.getItem('opencode-model');
    if (savedModel) {
      chat.setModel(savedModel);
    }

    const savedTheme = localStorage.getItem('opencode-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      document.querySelectorAll('.theme-opt').forEach(b => {
        b.classList.toggle('active', b.dataset.theme === savedTheme);
      });
    }
  }

  document.querySelectorAll('.setting-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const key = inp.id.replace('Key', '');
      const value = inp.value.trim();
      if (value) {
        localStorage.setItem(`opencode-key-${key}`, value);
        chat.setApiKey(key, value);
      }
    });
  });

  // Themes
  document.querySelectorAll('.theme-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.setAttribute('data-theme', btn.dataset.theme);
      localStorage.setItem('opencode-theme', btn.dataset.theme);
    });
  });

  // ===== MODELS =====
  function renderModels() {
    const freeContainer = document.getElementById('freeModels');
    const premiumContainer = document.getElementById('premiumModels');

    function renderModel(model, container) {
      const card = document.createElement('div');
      card.className = 'model-card';
      card.dataset.model = model.id;
      card.innerHTML = `
        <div class="model-card-icon" style="background:${model.color}20;color:${model.color}">${model.icon}</div>
        <div class="model-card-info">
          <div class="model-card-name">${model.name}</div>
          <div class="model-card-provider">${model.provider}</div>
        </div>
        <span class="model-card-badge ${container === freeContainer ? 'badge-free' : 'badge-premium'}">${container === freeContainer ? 'FREE' : 'PREMIUM'}</span>
      `;
      card.addEventListener('click', () => {
        document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        chat.setModel(model.id);
        localStorage.setItem('opencode-model', model.id);
        document.getElementById('currentModelBadge').textContent = model.name;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-tab="chat"]').classList.add('active');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById('chat-screen').classList.add('active');
      });

      const savedModel = localStorage.getItem('opencode-model');
      if (savedModel === model.id) {
        card.classList.add('selected');
      }

      container.appendChild(card);
    }

    freeContainer.innerHTML = '';
    premiumContainer.innerHTML = '';

    OPENCODE_MODELS.free.forEach(m => renderModel(m, freeContainer));
    OPENCODE_MODELS.premium.forEach(m => renderModel(m, premiumContainer));
  }

  // Model search
  document.getElementById('modelSearch')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.model-card').forEach(card => {
      const name = card.querySelector('.model-card-name').textContent.toLowerCase();
      const provider = card.querySelector('.model-card-provider').textContent.toLowerCase();
      card.style.display = name.includes(q) || provider.includes(q) ? '' : 'none';
    });
  });

  // ===== ATTACH BUTTON =====
  document.getElementById('attachBtn').addEventListener('click', () => {
    LiquidGlass.liquidRipple(document.getElementById('attachBtn'));
    input.focus();
  });

  // ===== INIT =====
  loadSettings();
  checkAuth();

  // Set initial model
  const initialModel = localStorage.getItem('opencode-model') || 'gemini-2.0-flash';
  chat.setModel(initialModel);

  // Auto-focus input after auth
  setTimeout(() => input.focus(), 500);
});
