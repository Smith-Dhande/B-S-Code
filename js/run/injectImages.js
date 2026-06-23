import {
    findFileByPath
}
from "./findFileByPath.js";

import {
    resolvePath
}
from "./resolvePath.js";

async function injectImages(
    html,
    items,
    htmlFilePath
) {

    const imageTags =
        [
            ...html.matchAll(
                /<img[^>]*src="([^"]+)"[^>]*>/gi
            )
        ];

    for (
        const match
        of imageTags
    ) {

        const imagePath =
            match[1];

        const resolvedPath =
            resolvePath(
                htmlFilePath,
                imagePath
            );

        const imageFile =
            findFileByPath(
                items,
                resolvedPath
            );

        if (
            !imageFile
        ) {

            console.warn(
                "Image not found:",
                resolvedPath
            );

            continue;

        }

        const file =
            await imageFile.handle.getFile();

        const base64 =
            await blobToBase64(
                file
            );

        html =
            html.replace(
                imagePath,
                base64
            );

    }

    return html;

}

function blobToBase64(
    blob
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();

            reader.onload =
                () =>
                    resolve(
                        reader.result
                    );

            reader.onerror =
                reject;

            reader.readAsDataURL(
                blob
            );

        }
    );

}

export {
    injectImages
};