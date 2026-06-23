import {
    findFileByPath
}
from "./findFileByPath.js";

import {
    resolvePath
}
from "./resolvePath.js";

import {
    bundleModules
}
from "./bundleModules.js";

async function injectJs(
    html,
    items,
    htmlFilePath
) {

    const scriptTags =
        [
            ...html.matchAll(
                /<script([^>]*)src=["']([^"']+\.js)["']([^>]*)><\/script>/gi
            )
        ];

    for (
        const match
        of scriptTags
    ) {

        const beforeAttrs =
            match[1];

        const src =
            match[2];

        const afterAttrs =
            match[3];

        const resolvedPath =
            resolvePath(
                htmlFilePath,
                src
            );

        const jsFile =
            findFileByPath(
                items,
                resolvedPath
            );

        if (
            !jsFile
        ) {

            console.warn(
                "JS file not found:",
                resolvedPath
            );

            continue;

        }

        const file =
            await jsFile.handle.getFile();

        let jsContent =
            await file.text();

        if (
            jsContent.includes(
                "import "
            )
        ) {

            jsContent =
                await bundleModules(
                    jsContent,
                    resolvedPath,
                    items
                );

        }

        html =
            html.replace(

                match[0],

                `
<script${beforeAttrs}${afterAttrs}>
${jsContent}
</script>
`

            );

    }

    return html;

}

export {
    injectJs
};