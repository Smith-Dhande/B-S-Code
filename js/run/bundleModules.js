import {
    findFileByPath
}
from "./findFileByPath.js";

import {
    resolvePath
}
from "./resolvePath.js";

async function bundleModules(
    jsContent,
    currentFilePath,
    items,
    visited = new Set()
) {

    const importMatches =
        [
            ...jsContent.matchAll(
                /import\s+.*?from\s+["'](.*?)["'];?/g
            )
        ];

    let bundledCode = "";

    for (
        const match
        of importMatches
    ) {

        const importPath =
            match[1];

        const resolvedPath =
            resolvePath(
                currentFilePath,
                importPath
            );

        if (
            visited.has(
                resolvedPath
            )
        ) {

            continue;

        }

        visited.add(
            resolvedPath
        );

        const moduleFile =
            findFileByPath(
                items,
                resolvedPath
            );

        if (
            !moduleFile
        ) {

            console.warn(
                "Module not found:",
                resolvedPath
            );

            continue;

        }

        const file =
            await moduleFile.handle.getFile();

        let moduleCode =
            await file.text();

        moduleCode =
            await bundleModules(
                moduleCode,
                resolvedPath,
                items,
                visited
            );

        moduleCode =
            moduleCode.replace(
                /export\s+default\s+/g,
                ""
            );

        moduleCode =
            moduleCode.replace(
                /export\s+/g,
                ""
            );

        bundledCode +=
            "\n" +
            moduleCode +
            "\n";

    }

    jsContent =
        jsContent.replace(
            /import\s+.*?from\s+["'].*?["'];?\s*/g,
            ""
        );

    jsContent =
        jsContent.replace(
            /export\s+default\s+/g,
            ""
        );

    jsContent =
        jsContent.replace(
            /export\s+/g,
            ""
        );

    bundledCode +=
        "\n" +
        jsContent;

    return bundledCode;

}

export {
    bundleModules
};