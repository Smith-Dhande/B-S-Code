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
- No comments outside the code.

`;

    const response =
        await generateResponse(
            model,
            prompt
        );

    return response.trim();

}

export {
    generateFileCode
};