import { state }
from "../state.js";

import {
    runProject
}
from "./runProject.js";

async function refreshPreview() {

    if (
        !state.previewWindow ||
        state.previewWindow.closed
    ) {

        return;

    }

    await runProject();

}

export {
    refreshPreview
};