import { state }
from "../state.js";
import {
    generateFileCode,
    fixFileCode
}
from "./codeGenerator.js";

import {
    createFolderByName
}
from "../explorer/createFolder.js";
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



let currentFileContent = "";
function findItemByName(
    items,
    name
) {

    for (
        const item
        of items
    ) {

        if (
            item.name === name
        ) {

            return item;

        }

        if (
            item.children
        ) {

            const found =
                findItemByName(
                    item.children,
                    name
                );

            if (found)
                return found;

        }

    }

    return null;

}
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

                currentFileContent =
                    await readFile(
                        fileHandle
                    );

                console.log(
                    "FILE CONTENT:",
                    currentFileContent
                );

                break;
            }
            case "fixFile": {

                const fileHandle =
                    await state.selectedFolder
                        .getFileHandle(
                            action.filename
                        );

                const currentCode =
                    await readFile(
                        fileHandle
                    );

                const fixedCode =
                    await fixFileCode(
                        state.currentModel,
                        action.filename,
                        currentCode,
                        action.instruction
                    );

                await writeFile(
                    fileHandle,
                    fixedCode
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
            case "createFolder": {

                await createFolderByName(
                    action.foldername,
                    state.selectedFolder
                );

                break;
            }
            case "deleteItem": {

                const item =
                    findItemByName(
                        state.folderStructure,
                        action.name
                    );

                if (!item) {

                    console.warn(
                        "Item not found:",
                        action.name
                    );

                    break;

                }

                await item.parentHandle
                    .removeEntry(
                        item.name,
                        {
                            recursive: true
                        }
                    );

                break;
            }
            default:

                console.warn(
                    "Unknown tool:",
                    action.tool
                );

        }

    }

    const expandedFolders =
    getExpandedFolders(
        state.folderStructure
    );

state.folderStructure =
    await getFolderContent(
        state.selectedFolder,
        "",
        expandedFolders
    );

    renderExplorer();

}

export {
    executePlan
};