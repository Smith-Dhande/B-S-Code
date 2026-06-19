import {
    generateResponse
} from "./ollama.js";

async function createPlan(
    userPrompt,
    model
) {

    const systemPrompt = `

You are an IDE Agent.

Available tools:

1. createFile(filename)
2. readFile(filename)
3. generateCode(filename, description)

IMPORTANT:

- Never generate source code inside JSON.
- Never use writeFile.
- Only create a plan.
- If multiple files are required, generate multiple actions.
- Return valid JSON only.
- Do not use markdown.
- Do not use code fences.
- Do not explain anything.

Example 1:

{
    "actions": [
        {
            "tool": "createFile",
            "filename": "HelloWorld.java"
        },
        {
            "tool": "generateCode",
            "filename": "HelloWorld.java",
            "description": "Java hello world program"
        }
    ]
}

Example 2:

{
    "actions": [
        {
            "tool": "readFile",
            "filename": "index.html"
        }
    ]
}

Example 3:

{
    "actions": [
        {
            "tool": "createFile",
            "filename": "index.html"
        },
        {
            "tool": "generateCode",
            "filename": "index.html",
            "description": "HTML for calculator application"
        },
        {
            "tool": "createFile",
            "filename": "style.css"
        },
        {
            "tool": "generateCode",
            "filename": "style.css",
            "description": "CSS styling for calculator application"
        },
        {
            "tool": "createFile",
            "filename": "script.js"
        },
        {
            "tool": "generateCode",
            "filename": "script.js",
            "description": "JavaScript logic for calculator application"
        }
    ]
}

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

    try {

        return JSON.parse(
            cleanResponse
        );

    } catch (error) {

        console.error(
            "INVALID JSON:",
            cleanResponse
        );

        throw new Error(
            "Model generated invalid JSON."
        );

    }

}

export {
    createPlan
};