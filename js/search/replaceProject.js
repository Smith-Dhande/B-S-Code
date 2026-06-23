import { state }
from "../state.js";

import { openFile }
from "../editor/openFile.js";

import { renderExplorer }
from "../explorer/renderExplorer.js";

import {
    getFolderContent
}
from "../filesystem/openFolder.js";

async function replaceProject(
    items,
    searchTerm,
    replaceTerm
) {

    let replacementCount =
        0;

    for (
        const item
        of items
    ) {

        if (
            item.type === "file"
        ) {

            try {

                const file =
                    await item.handle.getFile();

                const content =
                    await file.text();

                if (
                    !content.includes(
                        searchTerm
                    )
                ) {

                    continue;

                }

                const matches =
                    content.match(
                        new RegExp(
                            searchTerm,
                            "gi"
                        )
                    );

                if (
                    matches
                ) {

                    replacementCount +=
                        matches.length;

                }

                const updatedContent =
                    content.replaceAll(
                        searchTerm,
                        replaceTerm
                    );

                const writable =
                    await item.handle.createWritable();

                await writable.write(
                    updatedContent
                );

                await writable.close();

            }

            catch (
                error
            ) {

                console.error(
                    error
                );

            }

        }

        if (
            item.type === "directory"
        ) {

            replacementCount +=
                await replaceProject(
                    item.children,
                    searchTerm,
                    replaceTerm
                );

        }

    }

    if (
        items ===
        state.folderStructure
    ) {

        state.folderStructure =
            await getFolderContent(
                state.selectedFolder
            );

        renderExplorer();

        if (
            state.activeFile
        ) {

            console.log(
                "Refreshing:",
                state.activeFile.name
            );

            await openFile(
                state.activeFile
            );

        }

    }
    return replacementCount;

}

export {
    replaceProject
};