function findFileByPath(
    items,
    targetPath
) {

    for (
        const item
        of items
    ) {

        if (
            item.type === "file" &&
            item.path === targetPath
        ) {

            return item;

        }

        if (
            item.type === "directory"
        ) {

            const result =
                findFileByPath(
                    item.children,
                    targetPath
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
    findFileByPath
};