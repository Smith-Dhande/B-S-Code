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
2. createFolder(foldername)
3. readFile(filename)
4. deleteItem(name)
5. generateCode(filename, description)
6. fixFile(filename, instruction)


IMPORTANT:

- Never generate source code inside JSON.
- Never use writeFile.
- Only create a plan.
- If multiple files are required, generate multiple actions.
- Return valid JSON only.
- Do not use markdown at all.
- Do not use code fences.
- Do not use (````) at all.
- Do not explain anything.

When user asks to:
- fix bugs
- improve code
- refactor code
- optimize code
- update existing file

use fixFile.

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
    ],
    
}
    Example 4:
    {
        "actions": [
            {
                "tool": "createFolder",
                "foldername": "calculator"
            }
        ]
    },

    Examle 5:
    {
    "actions": [
        {
            "tool": "deleteItem",
            "name": "test.js"
        }
    ]
}
    Example 6:
    {
    "actions": [
        {
            "tool": "fixFile",
            "filename": "script.js",
            "instruction": "Fix bugs in script.js"
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