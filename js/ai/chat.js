import {
    createPlan
} from "./agent.js";

import {
    executePlan
} from "./agentExecutor.js";

import {
    generateResponse
} from "./ollama.js";

function renderMessage(
sender,
message
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

return messageElement;


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

    if (!prompt) return;

    renderMessage(
        "You",
        prompt
    );

    promptInput.value = "";

    const loadingMessage =
        renderMessage(
            "AI",
            "⏳ Thinking..."
        );

    try {

        const isAgentRequest =

            prompt.toLowerCase()
                .includes(
                    "create file"
                ) ||

            prompt.toLowerCase()
                .includes(
                    "create a file"
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

            await executePlan(
                plan
            );

            loadingMessage.innerHTML = `
                <div class="message-header">
                    AI
                </div>

                <div class="message-content">
                    ✅ Task completed successfully
                </div>
            `;

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

    }

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


}

export {
initializeChat
};
