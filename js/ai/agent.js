import {
generateResponse
} from "./ollama.js";

async function createPlan(
userPrompt,
model
) {


const systemPrompt = `


You are an IDE agent.

Available tools:

1. createFile(filename)
2. writeFile(filename, content)

Respond ONLY in JSON.

Example:

{
"actions": [
{
"tool": "createFile",
"filename": "HelloWorld.java"
}
]
}

IMPORTANT:
Do not use markdown.
Do not use code fences.
Return raw JSON only.
`;

const response =
    await generateResponse(
        model,
        `${systemPrompt}

User Request:
${userPrompt}`
);


console.log(
    "RAW RESPONSE:",
    response
);

const cleanResponse =
    response
        .replace(
            /```json/g,
            ""
        )
        .replace(
            /```/g,
            ""
        )
        .trim();

console.log(
    "CLEAN RESPONSE:",
    cleanResponse
);

return JSON.parse(
    cleanResponse
);


}

export {
createPlan
};
