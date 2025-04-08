document.addEventListener('DOMContentLoaded', function() {
    // OpenRouter models from api.txt
    const MODELS = [
        { id: "deepseek/deepseek-r1-distill-llama-70b:free", name: "DeepSeek R1 Distill LLama 70B", free: true },
        { id: "google/gemini-1.5-flash:free", name: "Gemini 1.5 Flash", free: true },
        { id: "deepseek/deepseek-chat:free", name: "DeepSeek Chat", free: true },
        { id: "mistralai/mistral-tiny:free", name: "Mistral Tiny", free: true },
        { id: "meta/llama-3-8b-instruct:free", name: "Llama 3 8B Instruct", free: true },
        { id: "aetherius/chronos-hermes-13b:free", name: "Chronos Hermes 13B", free: true },
        { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1", free: true }
    ];
    
    // Settings management
    let settings = {
        apiKey: localStorage.getItem('openRouterApiKey') || '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',
        customModels: JSON.parse(localStorage.getItem('customModels') || '[]')
    };
    
    // Current selected model
    let currentModel = localStorage.getItem('currentModel') || MODELS[0].id;
    
    // DOM elements
    const promptInput = document.getElementById('prompt-input');
    const sendButton = document.getElementById('send-button');
    const chatContainer = document.getElementById('chat-container');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings');
    const settingsBtn = document.getElementById('settings-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    const modelIdInput = document.getElementById('model-id-input');
    const modelNameInput = document.getElementById('model-name-input');
    const addModelBtn = document.getElementById('add-model-btn');
    const saveSettingsBtn = document.getElementById('save-settings');
    const customModelsList = document.getElementById('custom-models-list');
    const clearChatBtn = document.getElementById('clear-chat');
    const modelSelector = document.getElementById('model-selector');
    
    // Chat history
    let chatHistory = [];
    
    // Initialize settings
    function initializeSettings() {
        // Load API key
        apiKeyInput.value = settings.apiKey;
        
        // Load custom models
        customModelsList.innerHTML = '';
        settings.customModels.forEach(model => {
            addCustomModelToList(model);
        });
    }
    
    // Function to update all model selectors
    function updateModelSelectors() {
        // Update the main model selector dropdown
        const selector = document.getElementById('model-selector');
        if (selector) {
            // Save current value
            const currentValue = selector.value;
            
            // Clear existing options
            selector.innerHTML = '';
            
            // Add all models (built-in + custom)
            const allModels = [...MODELS, ...settings.customModels];
            allModels.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.name + (model.custom ? ' (Custom)' : '');
                selector.appendChild(option);
            });
            
            // Restore selected value or use current model
            selector.value = currentValue || currentModel;
        }
    }
    
    // Add custom model to the list
    function addCustomModelToList(model) {
        const modelItem = document.createElement('div');
        modelItem.classList.add('custom-model-item');
        modelItem.innerHTML = `
            <div class="custom-model-info">
                <div class="custom-model-name">${model.name}</div>
                <div class="custom-model-id">${model.id}</div>
            </div>
            <div class="custom-model-actions">
                <button class="delete-model" data-id="${model.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        modelItem.querySelector('.delete-model').addEventListener('click', () => {
            settings.customModels = settings.customModels.filter(m => m.id !== model.id);
            localStorage.setItem('customModels', JSON.stringify(settings.customModels));
            modelItem.remove();
            updateModelSelectors(); // Update all model dropdowns when deleting
        });
        
        customModelsList.appendChild(modelItem);
    }
    
    // Settings event listeners
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
        settingsModal.classList.add('visible');
    });
    
    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('visible');
        settingsModal.classList.add('hidden');
    });
    
    addModelBtn.addEventListener('click', () => {
        const id = modelIdInput.value.trim();
        const name = modelNameInput.value.trim();
        
        if (id && name) {
            const newModel = { id, name, custom: true };
            settings.customModels.push(newModel);
            localStorage.setItem('customModels', JSON.stringify(settings.customModels));
            addCustomModelToList(newModel);
            updateModelSelectors(); // Update all model dropdowns when adding
            
            modelIdInput.value = '';
            modelNameInput.value = '';
        }
    });
    
    saveSettingsBtn.addEventListener('click', () => {
        settings.apiKey = apiKeyInput.value.trim();
        localStorage.setItem('openRouterApiKey', settings.apiKey);
        settingsModal.classList.remove('visible');
        settingsModal.classList.add('hidden');
    });
    
    // Initialize settings and UI
    initializeSettings();
    addMobileMenuToggle();
    
    // Initialize model selector and populate with all models including custom ones
    updateModelSelectors();
    
    // Add event listener for model selection
    if (modelSelector) {
        modelSelector.addEventListener('change', function() {
            currentModel = this.value;
            localStorage.setItem('currentModel', currentModel);
            console.log(`Model changed to: ${currentModel}`);
        });
    }
    
    // Auto-resize textarea
    promptInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        // Enable/disable send button based on input
        if (this.value.trim().length > 0) {
            sendButton.classList.add('bg-[#9C44F3]');
            sendButton.classList.remove('bg-gray-700');
        } else {
            sendButton.classList.remove('bg-[#9C44F3]');
            sendButton.classList.add('bg-gray-700');
        }
    });
    
    // Send message on enter (without shift)
    promptInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.value.trim().length > 0) {
                sendMessage();
            }
        }
    });
    
    // Send button click handler
    sendButton.addEventListener('click', function() {
        if (promptInput.value.trim().length > 0) {
            sendMessage();
        }
    });
    
    // Function to send message
    async function sendMessage() {
        const userMessage = promptInput.value.trim();
        
        // Update chat history
        chatHistory.push({ role: "user", content: userMessage });
        
        // Clear the welcome message if it's the first message
        if (chatContainer.querySelector('h1')) {
            // Save the current model selection before clearing
            const currentModelValue = modelSelector ? modelSelector.value : currentModel;
            
            // Clear the chat container but keep a space for the model selector at the top
            chatContainer.innerHTML = `
                <div class="w-full sticky top-0 bg-[#343541] p-2 border-b border-gray-700 z-10">
                    <div class="max-w-3xl mx-auto flex items-center gap-3">
                        <label for="model-selector" class="text-gray-400 whitespace-nowrap">Model:</label>
                        <select id="model-selector" class="flex-grow bg-[#40414F] border border-gray-600 rounded p-1 text-white">
                            <!-- Will be populated by updateModelSelectors() -->
                        </select>
                    </div>
                </div>
            `;
            
            // Reinitialize the model selector and set its value
            updateModelSelectors();
            const newModelSelector = document.getElementById('model-selector');
            if (newModelSelector) {
                newModelSelector.value = currentModelValue;
                newModelSelector.addEventListener('change', function() {
                    currentModel = this.value;
                    localStorage.setItem('currentModel', currentModel);
                    console.log(`Model changed to: ${currentModel}`);
                });
            }
        }
        
        // Add user message to chat
        addMessageToChat('user', userMessage);
        
        // Clear input
        promptInput.value = '';
        promptInput.style.height = 'auto';
        sendButton.classList.remove('bg-[#9C44F3]');
        sendButton.classList.add('bg-gray-700');
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Call API to get response
            const response = await getAIResponse(userMessage);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Update chat history with AI response
            chatHistory.push({ role: "assistant", content: response });
            
            // Add AI response to chat
            addMessageToChat('bot', response);
        } catch (error) {
            console.error('Error getting AI response:', error);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add error message to chat
            addMessageToChat('bot', "I'm sorry, but I encountered an error processing your request. Please try again later.");
        }
    }
    
    // Function to get AI response from API
    async function getAIResponse(message) {
        try {
            if (!settings.apiKey) {
                return "Please set your OpenRouter API key in the settings to use the AI models.";
            }

            // Prepare messages array with system prompt and conversation history
            let messages = [
                {
                    role: "system",
                    content: "You are a helpful, friendly, and professional AI assistant. You provide accurate, insightful, and respectful responses."
                }
            ];
            
            // Add chat history (limited to last 10 messages to avoid token limits)
            messages = messages.concat(chatHistory.slice(-10));
            
            console.log("Sending request with model:", currentModel);
            
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${settings.apiKey}`,
                    "HTTP-Referer": window.location.href,
                    "X-Title": "ChatGPT Clone",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: currentModel,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                
                if (response.status === 401) {
                    return "Invalid OpenRouter API key. Please check your API key in the settings.";
                } else if (response.status === 429) {
                    return "Rate limit exceeded. Please try again later.";
                } else if (response.status === 404) {
                    return "The selected model is not available. Please try a different model.";
                }
                
                return errorData.error || "An error occurred while processing your request. Please try again later.";
            }
            
            const data = await response.json();
            console.log("API Response:", data);
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Network or parsing error:', error);
            return "A network error occurred. Please check your internet connection and try again.";
        }
    }
    
    // Function to add a message to the chat
    function addMessageToChat(sender, content) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('w-full', 'py-4', 'border-b', 'border-gray-700');
        
        if (sender === 'user') {
            messageContainer.classList.add('user-message');
        } else {
            messageContainer.classList.add('bot-message');
        }
        
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('w-full', 'max-w-3xl', 'mx-auto', 'flex');
        
        const iconContainer = document.createElement('div');
        iconContainer.classList.add('w-8', 'h-8', 'mr-4', 'flex-shrink-0', 'rounded-full', 'flex', 'items-center', 'justify-center');
        
        if (sender === 'user') {
            iconContainer.classList.add('bg-[#9C44F3]');
            iconContainer.textContent = 'U';
        } else {
            iconContainer.classList.add('bg-[#19C37D]');
            iconContainer.textContent = 'AI';
        }
        
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('flex-1', 'response-content');
        
        // Handle markdown formatting
        if (sender === 'bot') {
            // Simple markdown-like processing for code blocks and formatting
            const formattedContent = formatMarkdown(content);
            contentContainer.innerHTML = formattedContent;
        } else {
            contentContainer.textContent = content;
        }
        
        messageWrapper.appendChild(iconContainer);
        messageWrapper.appendChild(contentContainer);
        messageContainer.appendChild(messageWrapper);
        
        // Append message to chat container (after the model selector if present)
        chatContainer.appendChild(messageContainer);
        
        // Add syntax highlighting to code blocks
        if (sender === 'bot') {
            document.querySelectorAll('pre code').forEach((block) => {
                highlightCode(block);
                addCopyButton(block);
            });
        }
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Add copy button to code blocks
    function addCopyButton(block) {
        const pre = block.parentNode;
        const button = document.createElement('button');
        button.className = 'copy-code-button';
        button.textContent = 'Copy';
        
        button.addEventListener('click', () => {
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                button.textContent = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.textContent = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            });
        });
        
        pre.appendChild(button);
    }
    
    // Basic markdown formatter
    function formatMarkdown(text) {
        // Replace code blocks with syntax
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre${lang ? ` data-language="${lang}"` : ''}><code>${code}</code></pre>`;
        });
        
        // Replace code blocks without syntax
        text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Replace inline code
        text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        
        // Replace bold text
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Replace italic text
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Replace lists
        text = text.replace(/^\s*-\s+(.*)/gm, '<li>$1</li>').replace(/<\/li>\n<li>/g, '</li><li>');
        
        // Replace paragraphs
        text = text.replace(/\n\n/g, '</p><p>');
        
        return '<p>' + text + '</p>';
    }
    
    // Simple syntax highlighter for code blocks
    function highlightCode(block) {
        const code = block.textContent;
        let highlighted = code;
        const parent = block.parentNode;
        const language = parent.getAttribute('data-language') || detectLanguage(code);
        
        // Add language label
        if (language) {
            parent.setAttribute('data-language', language);
            parent.classList.add(`language-${language}`);
            
            if (parent.querySelector('.language-badge') === null) {
                const badge = document.createElement('span');
                badge.classList.add('language-badge');
                badge.textContent = language;
                parent.appendChild(badge);
            }
        }
        
        // Keywords (simplified)
        const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'return', 'for', 'while', 'class', 'async', 'await', 'import', 'export', 'from', 'try', 'catch'];
        keywords.forEach(keyword => {
            highlighted = highlighted.replace(new RegExp(`\\b${keyword}\\b`, 'g'), `<span class="text-pink-400">${keyword}</span>`);
        });
        
        // Strings
        highlighted = highlighted.replace(/(["'])(.*?)\1/g, '<span class="text-yellow-300">$1$2$1</span>');
        
        // Comments (simplified)
        highlighted = highlighted.replace(/(\/\/.*)/g, '<span class="text-gray-400">$1</span>');
        
        block.innerHTML = highlighted;
    }
    
    // Simple language detection
    function detectLanguage(code) {
        if (code.includes('function') || code.includes('const ') || code.includes('var ')) {
            return 'javascript';
        } else if (code.includes('def ') || code.includes('import ') && code.includes(':')) {
            return 'python';
        } else if (code.includes('class ') && code.includes('{')) {
            return 'java';
        } else if (code.includes('<html>') || code.includes('<!DOCTYPE')) {
            return 'html';
        } else if (code.includes('@media') || code.includes('.class')) {
            return 'css';
        } else {
            return 'code';
        }
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingContainer = document.createElement('div');
        typingContainer.id = 'typing-indicator';
        typingContainer.classList.add('w-full', 'py-4', 'border-b', 'border-gray-700', 'bot-message');
        
        const typingWrapper = document.createElement('div');
        typingWrapper.classList.add('w-full', 'max-w-3xl', 'mx-auto', 'flex');
        
        const iconContainer = document.createElement('div');
        iconContainer.classList.add('w-8', 'h-8', 'mr-4', 'flex-shrink-0', 'rounded-full', 'bg-[#19C37D]', 'flex', 'items-center', 'justify-center');
        iconContainer.textContent = 'AI';
        
        const indicatorContainer = document.createElement('div');
        indicatorContainer.classList.add('typing-indicator');
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            indicatorContainer.appendChild(dot);
        }
        
        typingWrapper.appendChild(iconContainer);
        typingWrapper.appendChild(indicatorContainer);
        typingContainer.appendChild(typingWrapper);
        
        // Append typing indicator to chat container (after the model selector)
        chatContainer.appendChild(typingContainer);
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Add mobile sidebar toggle functionality
    function addMobileMenuToggle() {
        // Create hamburger menu button for mobile
        const header = document.querySelector('.flex-1 > div:first-child');
        
        if (header) {
            const hamburgerBtn = document.createElement('button');
            hamburgerBtn.classList.add('hamburger-menu', 'p-2', 'mr-2', 'rounded', 'hover:bg-gray-700', 'hidden');
            hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
            
            header.prepend(hamburgerBtn);
            
            hamburgerBtn.addEventListener('click', () => {
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.toggle('show');
            });
            
            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                const sidebar = document.querySelector('.sidebar');
                const hamburgerBtn = document.querySelector('.hamburger-menu');
                
                if (!sidebar.contains(e.target) && e.target !== hamburgerBtn && 
                    !hamburgerBtn.contains(e.target) && sidebar.classList.contains('show')) {
                    sidebar.classList.remove('show');
                }
            });
        }
    }
    
    // Clear chat functionality
    clearChatBtn.addEventListener('click', () => {
        // Clear chat history
        chatHistory = [];
        
        // Check if we are in chat mode or welcome screen
        if (chatContainer.querySelector('.sticky')) {
            // We're in chat mode, keep the model selector at the top
            const currentModelValue = modelSelector ? modelSelector.value : currentModel;
            
            // Clear the chat except for the model selector
            const modelSelectorBar = chatContainer.querySelector('.sticky');
            chatContainer.innerHTML = '';
            chatContainer.appendChild(modelSelectorBar);
            
            // Reinitialize the model selector
            updateModelSelectors();
            const newModelSelector = document.getElementById('model-selector');
            if (newModelSelector) {
                newModelSelector.value = currentModelValue;
                newModelSelector.addEventListener('change', function() {
                    currentModel = this.value;
                    localStorage.setItem('currentModel', currentModel);
                    console.log(`Model changed to: ${currentModel}`);
                });
            }
        } else {
            // We're at the welcome screen, reset to original welcome screen
            chatContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full">
                    <h1 class="text-4xl font-bold mb-4">What can I help with?</h1>
                    
                    <!-- Model selection dropdown -->
                    <div class="mb-6 w-full max-w-md">
                        <label for="model-selector" class="block text-lg text-gray-400 mb-2 text-center">Select Model</label>
                        <select id="model-selector" class="w-full bg-[#40414F] border border-gray-600 rounded p-2 text-white">
                            <!-- Will be populated by updateModelSelectors() -->
                        </select>
                    </div>
                    
                    <!-- Available Models -->
                    <div class="flex flex-col gap-2 items-center mb-6 text-center">
                        <p class="text-md text-gray-400">Powered by multiple AI models</p>
                        <div class="flex flex-wrap justify-center gap-2 max-w-xl">
                            <span class="bg-gray-700 rounded-full px-3 py-1 text-xs">DeepSeek R1 Distill LLama 70B</span>
                            <span class="bg-gray-700 rounded-full px-3 py-1 text-xs">Gemini 1.5 Flash</span>
                            <span class="bg-gray-700 rounded-full px-3 py-1 text-xs">DeepSeek Chat</span>
                            <span class="bg-gray-700 rounded-full px-3 py-1 text-xs">Mistral Tiny</span>
                            <span class="bg-gray-700 rounded-full px-3 py-1 text-xs">Llama 3 8B Instruct</span>
                            <span class="bg-gray-700 rounded-full px-3 py-1 text-xs">Chronos Hermes 13B</span>
                            <span class="bg-gray-700 rounded-full px-3 py-1 text-xs">DeepSeek R1</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Re-initialize the model selector
            updateModelSelectors();
            
            // Re-add the event listener
            const newModelSelector = document.getElementById('model-selector');
            if (newModelSelector) {
                newModelSelector.value = currentModel;
                newModelSelector.addEventListener('change', function() {
                    currentModel = this.value;
                    localStorage.setItem('currentModel', currentModel);
                    console.log(`Model changed to: ${currentModel}`);
                });
            }
        }
    });
}); 