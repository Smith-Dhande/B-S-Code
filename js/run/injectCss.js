async function injectCss(
    html,
    items
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

        const cssPath =
            match[1];

        const cssFile =
            findFileByName(
                items,
                cssPath
            );

        if (
            !cssFile
        ) {

            continue;

        }

        const file =
            await cssFile.handle.getFile();

        const cssContent =
            await file.text();

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

function findFileByName(
    items,
    fileName
) {

    for (
        const item
        of items
    ) {

        if (
            item.type === "file" &&
            item.name === fileName
        ) {

            return item;

        }

        if (
            item.type === "directory"
        ) {

            const result =
                findFileByName(
                    item.children,
                    fileName
                );

            if (
                result
            ) {

                return result;

            }

        }

    }

    return null;

}

export {
    injectCss
};