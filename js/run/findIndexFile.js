function findIndexFile(
    items
) {

    for (
        const item
        of items
    ) {

        if (
            item.type === "file" &&
            item.name === "index.html"
        ) {

            return item;

        }

        if (
            item.type === "directory"
        ) {

            const result =
                findIndexFile(
                    item.children
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
    findIndexFile
};