const API_KEY = "AIzaSyDdsaS0XXWzzM-eP0feLzOxWgCX1j8_gWk"; // 🔑 Replace with your Gemini API key
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendBtn");
const themeToggle = document.getElementById("theme-toggle");
const languageSelect = document.getElementById("languageSelect");

let selectedLanguage = "English";

// ✅ Language Change
languageSelect.addEventListener("change", () => {
    selectedLanguage = languageSelect.value;
});

// ✅ Theme Toggle (Dark/Light)
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    themeToggle.textContent = document.body.classList.contains("light-theme") ? "☀️" : "🌙";
});

// ✅ Send Message
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

// ✅ Send Message Function
function sendMessage() {
    const userText = userInput.value.trim();
    if (!userText) return;

    // 📌 Display User Message
    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.innerHTML = userText;
    chatBox.appendChild(userMessage);
    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // ✨ Show Bot Typing
    const botTyping = document.createElement("div");
    botTyping.classList.add("bot-message");
    botTyping.innerHTML = `Typing...`;
    chatBox.appendChild(botTyping);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 🔥 Fetch AI Response
    fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{ 
                parts: [{ 
                    text: `Respond in ${selectedLanguage} only. User: "${userText}"` 
                }] 
            }]
        })
    })
    .then(response => response.json())
    .then(data => {
        botTyping.remove();
        if (data.candidates && data.candidates.length > 0) {
            displayBotMessage(data.candidates[0].content.parts[0].text);
        } else {
            displayBotMessage("Hmm, I’m having trouble responding. Try again?");
        }
    })
    .catch(() => {
        botTyping.remove();
        displayBotMessage("Oops, something went wrong!");
    });
}

// ✅ Display Bot Messages
function displayBotMessage(text) {
    const botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");
    botMessage.innerHTML = text;
    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}
