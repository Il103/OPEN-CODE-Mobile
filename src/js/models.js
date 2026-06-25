const OPENCODE_MODELS = {
  free: [
    {
      id: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      provider: 'Google',
      icon: '🧠',
      color: '#4285F4',
      keyRequired: 'gemini',
      description: 'Fast, free tier from Google'
    },
    {
      id: 'gemini-2.0-flash-lite',
      name: 'Gemini 2.0 Flash-Lite',
      provider: 'Google',
      icon: '⚡',
      color: '#4285F4',
      keyRequired: 'gemini',
      description: 'Lightweight, fastest option'
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'OpenAI',
      icon: '🤖',
      color: '#10a37f',
      keyRequired: 'openai',
      description: 'Small, efficient, affordable'
    },
    {
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      icon: '🌿',
      color: '#d97706',
      keyRequired: 'anthropic',
      description: 'Fast and compact'
    }
  ],
  premium: [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      icon: '⭐',
      color: '#10a37f',
      keyRequired: 'openai',
      description: 'High intelligence, multimodal'
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      icon: '🚀',
      color: '#10a37f',
      keyRequired: 'openai',
      description: 'Powerful, cost-effective'
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      icon: '🧠',
      color: '#10a37f',
      keyRequired: 'openai',
      description: 'Legacy high-quality model'
    },
    {
      id: 'claude-3.5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      icon: '🎯',
      color: '#d97706',
      keyRequired: 'anthropic',
      description: 'Best balance of speed and quality'
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      icon: '👑',
      color: '#d97706',
      keyRequired: 'anthropic',
      description: 'Most powerful Claude model'
    },
    {
      id: 'gemini-2.0-pro',
      name: 'Gemini 2.0 Pro',
      provider: 'Google',
      icon: '✨',
      color: '#4285F4',
      keyRequired: 'gemini',
      description: 'Google\'s most capable model'
    },
    {
      id: 'gemini-2.0-ultra',
      name: 'Gemini 2.0 Ultra',
      provider: 'Google',
      icon: '💎',
      color: '#4285F4',
      keyRequired: 'gemini',
      description: 'Ultra-grade performance'
    }
  ]
};

window.OPENCODE_MODELS = OPENCODE_MODELS;
