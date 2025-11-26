const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatLog = document.getElementById('chat-log');
const PLACEHOLDER_BASE = 'Ask anything';
const MAX_PLACEHOLDER_DOTS = 3;
const conversation = [];
let typingIndicator;
let placeholderDots = 0;
let placeholderInterval;

function setPlaceholderText(dots = placeholderDots) {
  const suffix = dots > 0 ? '.'.repeat(dots) : '';
  chatInput.placeholder = `${PLACEHOLDER_BASE}${suffix}`;
}

function startPlaceholderPulse() {
  if (placeholderInterval) return;
  placeholderInterval = setInterval(() => {
    const isUserTyping = document.activeElement === chatInput || chatInput.value.trim().length > 0;
    if (isUserTyping) {
      setPlaceholderText(MAX_PLACEHOLDER_DOTS);
      return;
    }
    placeholderDots = (placeholderDots + 1) % (MAX_PLACEHOLDER_DOTS + 1);
    setPlaceholderText();
  }, 500);
}

chatInput.addEventListener('focus', () => {
  chatInput.placeholder = '';
});

chatInput.addEventListener('blur', () => {
  if (!chatInput.value.trim()) {
    setPlaceholderText();
  }
});

setPlaceholderText(0);
startPlaceholderPulse();

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  conversation.push({ role: 'user', content: text });
  appendMessage('user', text);
  chatInput.value = '';
  setFormDisabled(true);
  showTypingIndicator();

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation })
    });
    const data = await response.json();
    const reply = data.reply ?? 'No response.';
    conversation.push({ role: 'assistant', content: reply });
    hideTypingIndicator();
    appendMessage('bot', reply);
  } catch (error) {
    console.error(error);
    hideTypingIndicator();
    appendMessage('bot', 'Something went wrong. Please try again later.');
  } finally {
    setFormDisabled(false);
  }
});

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

function appendMessage(role, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `chat-msg ${role}`;
  const bubble = document.createElement('span');
  bubble.textContent = text;
  wrapper.appendChild(bubble);
  chatLog.appendChild(wrapper);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function setFormDisabled(isDisabled) {
  chatInput.disabled = isDisabled;
  chatForm.querySelector('button').disabled = isDisabled;
}

function showTypingIndicator() {
  if (typingIndicator) return;
  typingIndicator = document.createElement('div');
  typingIndicator.className = 'chat-msg bot typing';
  const bubble = document.createElement('span');
  bubble.textContent = 'Charity Chat is composing...';
  typingIndicator.appendChild(bubble);
  chatLog.appendChild(typingIndicator);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function hideTypingIndicator() {
  if (!typingIndicator) return;
  typingIndicator.remove();
  typingIndicator = null;
}


