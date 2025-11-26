const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatLog = document.getElementById('chat-log');
const newChatBtn = document.querySelector('.new-chat-btn');
const conversation = [];
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

// New chat button
if (newChatBtn) {
  newChatBtn.addEventListener('click', () => {
    conversation.length = 0;
    chatLog.innerHTML = `
      <div class="empty-state">
        <div class="logo-badge-large">
          <img src="cclogo.png" alt="Charity Chat" />
        </div>
        <h1>How can I help you today?</h1>
      </div>
    `;
  });
}

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
