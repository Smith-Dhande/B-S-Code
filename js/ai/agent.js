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
3. readFile(filename)

Respond ONLY in JSON.

Example 1:

{
"actions": [
{
"tool": "createFile",
"filename": "HelloWorld.java"
}
]
}

Example 2:

{
"actions": [
{
"tool": "readFile",
"filename": "Test.java"
}
]
}

Example 3:

{
"actions": [
{
"tool": "createFile",
"filename": "HelloWorld.java"
},
{
"tool": "writeFile",
"filename": "HelloWorld.java",
"content": "public class HelloWorld {}"
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
