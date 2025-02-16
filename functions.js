const API_KEY = "AIzaSyDdsaS0XXWzzM-eP0feLzOxWgCX1j8_gWk"; // 🔑 Replace with your Gemini API key
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendBtn");
const themeToggle = document.getElementById("theme-toggle");
const languageSelect = document.getElementById("languageSelect");

let selectedLanguage = "English"; // Default language

// ✅ Change Language When Selected
languageSelect.addEventListener("change", () => {
    selectedLanguage = languageSelect.value;
});

// ✅ Show Chat Screen After Splash Screen
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.querySelector(".splash-screen").style.display = "none";
        document.querySelector(".chat-container").style.display = "block";
    }, 3000);
});

// ✅ Theme Toggle (Dark/Light Mode)
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    themeToggle.textContent = document.body.classList.contains("light-theme") ? "☀️" : "🌙";
});

// ✅ Send Message on Button Click or Enter Key
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

// ✅ Send Message Function (With AI Response in Selected Language)
function sendMessage() {
    const userText = userInput.value.trim();
    if (!userText) return;

    // 📌 Display User Message
    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.innerHTML = `${userText} <span class='time-stamp'>${new Date().toLocaleTimeString()}</span>`;
    chatBox.appendChild(userMessage);
    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // 🚨 Check for Dangerous Messages
    if (isDangerous(userText)) {
        displayBotMessage("Hey, I'm here for you. 💙 You’re not alone. Please talk to someone you trust or reach out to a professional therapist. 🙏");
        return;
    }

    // ✨ Show Bot Typing Indicator
    const botTyping = document.createElement("div");
    botTyping.classList.add("bot-message");
    botTyping.innerHTML = `Typing...`;
    chatBox.appendChild(botTyping);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 🔥 Fetch AI Response from Gemini API in Selected Language
    fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{ 
                parts: [{ 
                    text: `Act like a professional therapist, but talk like a supportive best friend in short, human-like sentences. Keep it warm, natural, and caring. If the user sounds sad, reassure them with kindness. If they say something dangerous, urge them to seek real help.

                    Respond to the following message in ${selectedLanguage} only. If the user speaks in ${selectedLanguage}, reply in ${selectedLanguage}:

                    User: "${userText}" 

                    Reply:` 
                }] 
            }]
        })
    })
    .then(response => response.json())
    .then(data => {
        botTyping.remove(); // Remove "Typing..." message

        if (data.candidates && data.candidates.length > 0) {
            let botResponse = data.candidates[0].content.parts[0].text;
            displayBotMessage(botResponse);
        } else {
            displayBotMessage("Hmm, I’m having trouble responding. Try again?");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        botTyping.remove(); // Remove "Typing..." message
        displayBotMessage("Oops, something went wrong. Let's try again!");
    });
}

// ✅ Function to Detect Dangerous Messages
function isDangerous(message) {
    const dangerWords = ["suicide", "hurt myself", "end it", "kill myself", "give up", "no hope", "self-harm", "can't go on"];
    return dangerWords.some(word => message.toLowerCase().includes(word));
}

// ✅ Display Bot Messages
function displayBotMessage(text) {
    const botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");
    botMessage.innerHTML = `${text} <span class='time-stamp'>${new Date().toLocaleTimeString()}</span>`;
    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}
