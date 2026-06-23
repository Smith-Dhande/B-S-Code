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