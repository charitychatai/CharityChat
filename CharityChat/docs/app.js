const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatLog = document.getElementById('chat-log');
const newChatBtn = document.querySelector('.new-chat-btn');
const historyList = document.getElementById('history-list');
const conversation = [];
const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
let typingIndicator;
let placeholderInterval;
let dotCount = 0;

// Animated placeholder
function animatePlaceholder() {
  if (document.activeElement === chatInput || chatInput.value.trim().length > 0) {
    return;
  }
  dotCount = (dotCount % 3) + 1;
  chatInput.placeholder = 'Ask anything' + '.'.repeat(dotCount);
}

// Start placeholder animation
placeholderInterval = setInterval(animatePlaceholder, 500);

chatInput.addEventListener('focus', () => {
  chatInput.placeholder = '';
});

chatInput.addEventListener('blur', () => {
  if (!chatInput.value.trim()) {
    dotCount = 0;
    chatInput.placeholder = 'Ask anything';
  }
});

// Auto-resize textarea
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 200) + 'px';
});

// Load chat history on page load
function loadChatHistory() {
  if (!historyList) return;
  historyList.innerHTML = '';
  
  chatHistory.slice(-10).reverse().forEach((item, index) => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>${item.preview}</span>
    `;
    historyItem.addEventListener('click', () => loadConversation(chatHistory.length - 1 - index));
    historyList.appendChild(historyItem);
  });
}

function saveConversationToHistory() {
  if (conversation.length === 0) return;
  
  const firstUserMsg = conversation.find(m => m.role === 'user');
  if (!firstUserMsg) return;
  
  const preview = firstUserMsg.content.substring(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '');
  
  const historyItem = {
    preview,
    messages: [...conversation],
    timestamp: Date.now()
  };
  
  chatHistory.push(historyItem);
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory.slice(-20))); // Keep last 20
  loadChatHistory();
}

function loadConversation(index) {
  if (!chatHistory[index]) return;
  
  conversation.length = 0;
  conversation.push(...chatHistory[index].messages);
  
  // Clear and rebuild chat log
  const emptyState = chatLog.querySelector('.empty-state');
  if (emptyState) emptyState.remove();
  
  chatLog.innerHTML = '';
  conversation.forEach(msg => {
    appendMessage(msg.role === 'user' ? 'user' : 'bot', msg.content);
  });
}

// New chat button
if (newChatBtn) {
  newChatBtn.addEventListener('click', () => {
    if (conversation.length > 0) {
      saveConversationToHistory();
    }
    conversation.length = 0;
    chatLog.innerHTML = `
      <div class="empty-state">
        <div class="logo-badge-large">
          <img src="cclogo.png" alt="Charity Chat" />
        </div>
        <p class="charity-tagline">
          99% of ad revenue from this AI goes straight to <a href="#" target="_blank" rel="noopener">verified charities</a>
        </p>
        <h1>How can I help you today?</h1>
      </div>
    `;
  });
}

// Load history on startup
loadChatHistory();

// Submit form
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  // Remove empty state if present
  const emptyState = chatLog.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }

  conversation.push({ role: 'user', content: text });
  appendMessage('user', text);
  chatInput.value = '';
  chatInput.style.height = 'auto';
  setFormDisabled(true);
  showTypingIndicator();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation })
    });
    const data = await response.json();
    
    if (!response.ok || data.error) {
      const errorMsg = data.error || `API error: ${response.status}`;
      console.error('API error:', errorMsg);
      hideTypingIndicator();
      appendMessage('bot', `Error: ${errorMsg}`);
      return;
    }
    
    const reply = data.reply ?? 'No response.';
    conversation.push({ role: 'assistant', content: reply });
    hideTypingIndicator();
    appendMessage('bot', reply);
  } catch (error) {
    console.error(error);
    hideTypingIndicator();
    appendMessage('bot', `Network error: ${error.message}`);
  } finally {
    setFormDisabled(false);
    chatInput.focus();
  }
});

// Enter to submit, Shift+Enter for new line
chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

function appendMessage(role, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `chat-msg ${role}`;
  
  if (role === 'bot') {
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = '<img src="cclogo.png" alt="CC" />';
    wrapper.appendChild(avatar);
  }
  
  const content = document.createElement('div');
  content.className = 'msg-content';
  content.textContent = text;
  wrapper.appendChild(content);
  
  chatLog.appendChild(wrapper);
  chatLog.parentElement.scrollTop = chatLog.parentElement.scrollHeight;
}

function setFormDisabled(isDisabled) {
  chatInput.disabled = isDisabled;
  const sendBtn = chatForm.querySelector('button');
  if (sendBtn) sendBtn.disabled = isDisabled;
}

function showTypingIndicator() {
  if (typingIndicator) return;
  typingIndicator = document.createElement('div');
  typingIndicator.className = 'chat-msg bot typing';
  
  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.innerHTML = '<img src="cclogo.png" alt="CC" />';
  typingIndicator.appendChild(avatar);
  
  const content = document.createElement('div');
  content.className = 'msg-content';
  content.textContent = 'Thinking...';
  typingIndicator.appendChild(content);
  
  chatLog.appendChild(typingIndicator);
  chatLog.parentElement.scrollTop = chatLog.parentElement.scrollHeight;
}

function hideTypingIndicator() {
  if (!typingIndicator) return;
  typingIndicator.remove();
  typingIndicator = null;
}
