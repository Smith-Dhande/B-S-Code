async function searchProject(
    items,
    searchTerm,
    results = []
) {

    for (
        const item
        of items
    ) {

        if (
            item.type === "file"
        ) {

            const BINARY_EXTENSIONS = new Set([
                'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'pdf', 'zip', 'tar', 'gz', 'rar', '7z',
                'mp3', 'mp4', 'wav', 'webm', 'ogg', 'woff', 'woff2', 'ttf', 'otf', 'eot',
                'exe', 'dll', 'so', 'dylib', 'bin', 'map'
            ]);
            const ext = item.name.split('.').pop().toLowerCase();
            if (BINARY_EXTENSIONS.has(ext)) {
                continue;
            }

            try {

                const file =
                    await item.handle.getFile();

                const content =
                    await file.text();

                const lines =
                    content.split("\n");

                lines.forEach(
                    (
                        line,
                        index
                    ) => {

                        if (
                            line
                            .toLowerCase()
                            .includes(
                                searchTerm.toLowerCase()
                            )
                        ) {

                            results.push({

                                fileName:
                                    item.name,

                                lineNumber:
                                    index + 1,

                                lineText:
                                    line.trim(),

                                fileItem:
                                    item

                            });

                        }

                    }
                );

            }

            catch (
                error
            ) {

                console.error(
                    error
                );

            }

        }

        if (
            item.type === "directory"
        ) {

            await searchProject(
                item.children,
                searchTerm,
                results
            );

        }

    }

    return results;

}

export {
    searchProject
};