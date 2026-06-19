import { state }
from "../state.js";

import {
    createFileByName
}
from "../explorer/createFile.js";

import {
    writeFile
}
from "../filesystem/writeFile.js";

import {
    readFile
}
from "../filesystem/readFile.js";

import {
    getFolderContent
}
from "../filesystem/openFolder.js";

import {
    renderExplorer
}
from "../explorer/renderExplorer.js";

import {
    openFile
}
from "../editor/openFile.js";

import {
    generateFileCode
}
from "./codeGenerator.js";

async function executePlan(
    plan
) {

    for (
        const action
        of plan.actions
    ) {

        console.log(
            "Executing:",
            action
        );

        switch (
            action.tool
        ) {

            case "createFile": {

                await createFileByName(
                    action.filename,
                    state.selectedFolder
                );

                break;
            }

            case "generateCode": {

                const fileHandle =
                    await state.selectedFolder
                        .getFileHandle(
                            action.filename
                        );

                const generatedCode =
                    await generateFileCode(
                        state.currentModel,
                        action.filename,
                        action.description
                    );

                await writeFile(
                    fileHandle,
                    generatedCode
                );

                if (
                    state.activeFile &&
                    state.activeFile.name ===
                    action.filename
                ) {

                    await openFile(
                        state.activeFile
                    );

                }

                break;
            }

            case "readFile": {

                const fileHandle =
                    await state.selectedFolder
                        .getFileHandle(
                            action.filename
                        );

                const content =
                    await readFile(
                        fileHandle
                    );

                console.log(
                    "FILE CONTENT:",
                    content
                );

                return content;
            }

            default:

                console.warn(
                    "Unknown tool:",
                    action.tool
                );

        }

    }

    state.folderStructure =
        await getFolderContent(
            state.selectedFolder
        );

    renderExplorer();

}

export {
    executePlan
};