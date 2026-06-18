import { renderExplorer } from "../explorer/renderExplorer.js";
import { state } from "../state.js";

async function readDirectory(directoryHandle) {

    state.folderStructure = [];

    for await (const [name, handle] of directoryHandle.entries()) {

        state.folderStructure.push({
            name,
            handle,
            kind: handle.kind
        });

    }

    renderExplorer();
}

export { readDirectory };