import {
    createPlan
}
from "./agent.js";

import {
    executePlan
}
from "./agentExecutor.js";

import {
    generateResponse
}
from "./ollama.js";

import {
    state
}
from "../state.js";

import {
    updateUI
}
from "../ui/updateUI.js";

function saveChatHistory() {

    sessionStorage.setItem(
        "chatHistory",
        JSON.stringify(
            state.chatHistory
        )
    );

}

function renderMessage(
    sender,
    message,
    save = true
) {

    const chatHistory =
        document.getElementById(
            "chat-history"
        );

    const messageElement =
        document.createElement(
            "div"
        );

    messageElement.classList.add(
        sender === "You"
            ? "user-message"
            : "ai-message"
    );

    messageElement.innerHTML = `
        <div class="message-header">
            ${sender}
        </div>

        <div class="message-content">
            ${message}
        </div>
    `;

    chatHistory.appendChild(
        messageElement
    );

    chatHistory.scrollTop =
        chatHistory.scrollHeight;

    if (save) {

        state.chatHistory.push({
            sender,
            message
        });

        saveChatHistory();

    }

    return messageElement;

}

function restoreChatHistory() {

    const storedHistory =
        JSON.parse(
            sessionStorage.getItem(
                "chatHistory"
            )
        ) || [];

    state.chatHistory =
        storedHistory;

    storedHistory.forEach(
        (chat) => {

            renderMessage(
                chat.sender,
                chat.message,
                false
            );

        }
    );

}

async function handleChat() {

    const promptInput =
        document.getElementById(
            "prompt-input"
        );

    const modelSelector =
        document.getElementById(
            "model-selector"
        );

    const prompt =
        promptInput.value.trim();

    const model =
        modelSelector.value;

    if (!prompt)
        return;

    state.currentModel =
        model;

    sessionStorage.setItem(
        "currentModel",
        model
    );

    updateUI();

    renderMessage(
        "You",
        prompt
    );

    promptInput.value = "";

    const loadingMessage =
        renderMessage(
            "AI",
            "⏳ Thinking...",
            false
        );

    try {

        const lowerPrompt =
            prompt.toLowerCase();

        const isAgentRequest =

            lowerPrompt.includes(
                "create"
            ) ||

            lowerPrompt.includes(
                "read"
            ) ||

            lowerPrompt.includes(
                "write"
            ) ||

            lowerPrompt.includes(
                "fix"
            ) ||

            lowerPrompt.includes(
                "update"
            ) ||

            lowerPrompt.includes(
                "modify"
            ) ||

            lowerPrompt.includes(
                "delete"
            );

        console.log(
            "Agent Mode:",
            isAgentRequest
        );

        if (
            isAgentRequest
        ) {

            const plan =
                await createPlan(
                    prompt,
                    model
                );

            console.log(
                "Agent Plan:",
                plan
            );

            const result =
                await executePlan(
                    plan
                );

            let finalMessage =
                result
                    ? result
                    : "✅ Task completed successfully";

            loadingMessage.innerHTML = `
                <div class="message-header">
                    AI
                </div>

                <div class="message-content">
                    ${finalMessage}
                </div>
            `;

            state.chatHistory.push({
                sender: "AI",
                message: finalMessage
            });

            saveChatHistory();

            return;

        }

        const response =
            await generateResponse(
                model,
                prompt
            );

        loadingMessage.innerHTML = `
            <div class="message-header">
                AI
            </div>

            <div class="message-content">
                ${response}
            </div>
        `;

        state.chatHistory.push({
            sender: "AI",
            message: response
        });

        saveChatHistory();

    } catch (error) {

        console.error(
            error
        );

        loadingMessage.innerHTML = `
            <div class="message-header">
                AI
            </div>

            <div class="message-content">
                Error:
                ${error.message}
            </div>
        `;

        state.chatHistory.push({
            sender: "AI",
            message: `Error: ${error.message}`
        });

        saveChatHistory();

    }

    updateUI();

}

function initializeChat() {

    const sendButton =
        document.getElementById(
            "send-prompt-button"
        );

    sendButton.addEventListener(
        "click",
        handleChat
    );

    const savedModel =
        sessionStorage.getItem(
            "currentModel"
        );

    if (savedModel) {

        state.currentModel =
            savedModel;

    }

    restoreChatHistory();

    updateUI();

}

export {
    initializeChat
};