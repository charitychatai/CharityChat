const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatLog = document.getElementById('chat-log');
const searchLinks = document.getElementById('search-links');

const seedLinks = [
  {
    label: 'How to support charity',
    url: 'https://www.google.com/search?q=how+to+support+charity'
  },
  {
    label: 'Climate change donations',
    url: 'https://www.google.com/search?q=climate+change+donations'
  },
  {
    label: 'Best global health charities',
    url: 'https://www.google.com/search?q=best+global+health+charities'
  }
];

seedLinks.forEach(({ label, url }) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = url;
  a.textContent = label;
  a.target = '_blank';
  a.rel = 'noopener';
  li.appendChild(a);
  searchLinks.appendChild(li);
});

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  appendMessage('user', text);
  chatInput.value = '';
  setFormDisabled(true);

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await response.json();
    appendMessage('bot', data.reply ?? 'No response.');
  } catch (error) {
    console.error(error);
    appendMessage('bot', 'Something went wrong. Please try again later.');
  } finally {
    setFormDisabled(false);
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


