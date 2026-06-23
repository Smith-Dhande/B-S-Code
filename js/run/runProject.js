import { state } from "../state.js";

import { findIndexFile } from "./findIndexFile.js";

import { injectCss } from "./injectCss.js";

import { injectImages }from "./injectImages.js";

import { injectJs } from "./injectJs.js";

async function runProject() {

    const indexFile =
        findIndexFile(
            state.folderStructure
        );

    if (
        !indexFile
    ) {

        console.error(
            "index.html not found"
        );

        return;

    }

    const file =
        await indexFile.handle.getFile();

    let html =
    await file.text();

html =
    await injectCss(
        html,
        state.folderStructure,
        indexFile.path
    );
    html =
    await injectImages(
        html,
        state.folderStructure,
        indexFile.path
    );
    html =
    await injectJs(
        html,
        state.folderStructure,
        indexFile.path
    );

    const blob =
        new Blob(
            [html],
            {
                type:
                    "text/html"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    if (
        state.previewWindow &&
        !state.previewWindow.closed
    ) {

        state.previewWindow.location =
            url;

    }

    else {

        state.previewWindow =
            window.open(
                url,
                "_blank"
            );

    }

    state.previewUrl =
        url;

}

export {
    runProject
};