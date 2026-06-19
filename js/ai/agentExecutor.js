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
getFolderContent
}
from "../filesystem/openFolder.js";

import {
renderExplorer
}
from "../explorer/renderExplorer.js";

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

        case "writeFile": {

            const fileHandle =
                await state.selectedFolder
                    .getFileHandle(
                        action.filename
                    );

            await writeFile(
                fileHandle,
                action.content
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

state.folderStructure =
    await getFolderContent(
        state.selectedFolder
    );

renderExplorer();


}

export {
executePlan
};
