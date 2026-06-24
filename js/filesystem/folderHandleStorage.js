async function saveFolderHandle(
    folderHandle
) {

    const database =
        await openDatabase();

    const transaction =
        database.transaction(
            "handles",
            "readwrite"
        );

    const store =
        transaction.objectStore(
            "handles"
        );

    await store.put(
        folderHandle,
        "projectFolder"
    );

}

async function loadFolderHandle() {

    const database =
        await openDatabase();

    const transaction =
        database.transaction(
            "handles",
            "readonly"
        );

    const store =
        transaction.objectStore(
            "handles"
        );

    return await new Promise(
        (
            resolve
        ) => {

            const request =
                store.get(
                    "projectFolder"
                );

            request.onsuccess =
                () =>
                    resolve(
                        request.result
                    );

        }
    );

}

function openDatabase() {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const request =
                indexedDB.open(
                    "BSCodeDB",
                    1
                );

            request.onupgradeneeded =
                () => {

                    request.result.createObjectStore(
                        "handles"
                    );

                };

            request.onsuccess =
                () =>
                    resolve(
                        request.result
                    );

            request.onerror =
                () =>
                    reject(
                        request.error
                    );

        }
    );

}

export {
    saveFolderHandle,
    loadFolderHandle
};