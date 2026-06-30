async function saveFolderHandle(
    folderHandle
) {

    try {
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
    } catch (error) {
        console.error("Failed to save folder handle to IndexedDB:", error);
    }

}

async function loadFolderHandle() {

    try {
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

                request.onerror =
                    () =>
                        resolve(null);

            }
        );
    } catch (error) {
        console.error("Failed to load folder handle from IndexedDB:", error);
        return null;
    }

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
    loadFolderHandle,
    openDatabase
};