const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Function to add a message to the chat window
function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(sender === 'user' ? 'user-msg' : 'ai-msg');
    
if (sender === 'ai') {
        let htmlContent = marked.parse(text);
        msgDiv.innerHTML = htmlContent;

        const preElements = msgDiv.querySelectorAll('pre');
        preElements.forEach((pre) => {
            // 1. Highlight the code using Prism
            Prism.highlightElement(pre);

            const container = document.createElement('div');
            container.classList.add('code-container');
            
            const button = document.createElement('button');
            button.innerText = 'Copy';
            button.classList.add('copy-btn');
            
            button.addEventListener('click', () => {
                const codeText = pre.innerText; // Simplified for Prism
                navigator.clipboard.writeText(codeText).then(() => {
                    button.innerText = 'Copied!';
                    button.classList.add('copied');
                    setTimeout(() => {
                        button.innerText = 'Copy';
                        button.classList.remove('copied');
                    }, 2000);
                });
            });

            pre.parentNode.insertBefore(container, pre);
            container.appendChild(pre);
            container.appendChild(button);
        });
    } else {
        msgDiv.textContent = text;
    }
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to send the message to our Node.js backend
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Display user message
    addMessage(text, 'user');
    userInput.value = '';

    try {
        // Send request to backend
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        // Display AI response
        if (data.reply) {
            addMessage(data.reply, 'ai');
        } else {
            addMessage("Error: Could not get a response.", 'ai');
        }

    } catch (error) {
        addMessage("Error: Server is unreachable.", 'ai');
    }
}

// Event listeners for clicks and the Enter key
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
const loadingIndicator = document.getElementById('loading');

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Display user message
    addMessage(text, 'user');
    userInput.value = '';

    // 2. Show the loading dots & move them to the bottom
    loadingIndicator.style.display = 'block';
    chatBox.appendChild(loadingIndicator); // Keeps dots at the very bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        // 3. Hide loading dots before showing the reply
        loadingIndicator.style.display = 'none';

        if (data.reply) {
            addMessage(data.reply, 'ai');
        } else {
            addMessage("Error: Could not get a response.", 'ai');
        }

    } catch (error) {
        loadingIndicator.style.display = 'none';
        addMessage("Error: Server is unreachable.", 'ai');
    }
}
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved user preference
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerText = '☀️ Light Mode';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Update button text and save preference
    if (body.classList.contains('dark-mode')) {
        themeToggle.innerText = '☀️ Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerText = '🌙 Dark Mode';
        localStorage.setItem('theme', 'light');
    }
});