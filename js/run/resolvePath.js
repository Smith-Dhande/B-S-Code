function resolvePath(
    currentFilePath,
    targetPath
) {

    const currentParts =
        currentFilePath.split(
            "/"
        );

    currentParts.pop();

    const targetParts =
        targetPath.split(
            "/"
        );

    for (
        const part
        of targetParts
    ) {

        if (
            part === "."
        ) {

            continue;

        }

        if (
            part === ".."
        ) {

            currentParts.pop();

            continue;

        }

        currentParts.push(
            part
        );

    }

    return currentParts.join(
        "/"
    );

}

export {
    resolvePath
};