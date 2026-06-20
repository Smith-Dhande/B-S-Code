import {
    generateResponse
}
from "./ollama.js";

async function generateFileCode(
    model,
    filename,
    description
) {

    const prompt = `

You are a code generator.

Generate ONLY the contents of:

${filename}

Requirements:

${description}

Rules:

- Return code only.
- No markdown.
- No code fences.
- No explanations.

`;

    const response =
        await generateResponse(
            model,
            prompt
        );

    return response.trim();

}

async function fixFileCode(
    model,
    filename,
    currentCode,
    instruction
) {

    const prompt = `

You are a senior software engineer.

File Name:
${filename}

Current Code:

${currentCode}

Task:

${instruction}

Rules:

- Return the COMPLETE updated file.
- Do not explain anything.
- Do not use markdown.
- Do not use code fences.
- Return code only.

`;

    const response =
        await generateResponse(
            model,
            prompt
        );

    return response.trim();

}

export {
    generateFileCode,
    fixFileCode
};