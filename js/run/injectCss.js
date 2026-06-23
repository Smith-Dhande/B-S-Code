import {
    findFileByPath
}
from "./findFileByPath.js";

import {
    processCssImages
}
from "./processCssImages.js";

import {
    resolvePath
}
from "./resolvePath.js";

async function injectCss(
    html,
    items,
    htmlFilePath
) {

    const cssLinks =
        [
            ...html.matchAll(
                /<link[^>]*href="([^"]+\.css)"[^>]*>/gi
            )
        ];

    for (
        const match
        of cssLinks
    ) {

        const href =
            match[1];

        const resolvedPath =
            resolvePath(
                htmlFilePath,
                href
            );

        const cssFile =
            findFileByPath(
                items,
                resolvedPath
            );

        if (
            !cssFile
        ) {

            console.warn(
                "CSS file not found:",
                resolvedPath
            );

            continue;

        }

        const file =
            await cssFile.handle.getFile();

        let cssContent =
            await file.text();

        cssContent =
            await processCssImages(
                cssContent,
                items,
                cssFile.path
            );

        html =
            html.replace(

                match[0],

                `
<style>
${cssContent}
</style>
`

            );

    }

    return html;

}

export {
    injectCss
};