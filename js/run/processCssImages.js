import {
    findFileByPath
}
from "./findFileByPath.js";

import {
    resolvePath
}
from "./resolvePath.js";

async function processCssImages(
    cssContent,
    items,
    cssFilePath
) {

    const urls =
        [
            ...cssContent.matchAll(
                /url\((['"]?)(.*?)\1\)/gi
            )
        ];

    for (
        const match
        of urls
    ) {

        const imagePath =
            match[2];

        if (
            imagePath.startsWith(
                "data:"
            )
        ) {

            continue;

        }

        const resolvedPath =
            resolvePath(
                cssFilePath,
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

            continue;

        }

        const file =
            await imageFile.handle.getFile();

        const base64 =
            await blobToBase64(
                file
            );

        cssContent =
            cssContent.replace(
                imagePath,
                base64
            );

    }

    return cssContent;

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
    processCssImages
};