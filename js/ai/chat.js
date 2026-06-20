import {
createPlan
} from "./agent.js";

import {
executePlan
} from "./agentExecutor.js";

import {
generateResponse
} from "./ollama.js";

import {
    state
}
from "../state.js";
import { updateUI } from "../ui/updateUI.js";
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
state.currentModel =
    model;
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

        if (result) {

            loadingMessage.innerHTML = `
                <div class="message-header">
                    AI
                </div>

                <div class="message-content">
                    ${result}
                </div>
            `;

            return;
        }

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
updateUI()

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
updateUI();

}

export {
initializeChat
};
