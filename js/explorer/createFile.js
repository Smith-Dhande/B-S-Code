    import { state } from "../state.js";

    import { renderExplorer }
    from "./renderExplorer.js";

    async function createFile() {

        if (
            !state.selectedFolder
        ) {

            console.log(
                "Open a folder first"
            );

            return;

        }

        state.isCreatingFolder =
            false;

        state.isCreatingFile =
            true;

        renderExplorer();

    }

    async function createFileByName(
        fileName,
        targetFolder
    ) {

        const fileHandle =
            await targetFolder.getFileHandle(
                fileName,
                {
                    create: true
                }
            );

        return fileHandle;

    }

    export {
        createFile,
        createFileByName
    };