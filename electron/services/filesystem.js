const fs = require("fs").promises;

const path = require("path");

const {
    dialog
} = require("electron");

async function openFolder() {

    const result =
        await dialog.showOpenDialog({

            properties: [
                "openDirectory"
            ]

        });

    if (
        result.canceled
    ) {

        return null;

    }

    const projectPath =
        result.filePaths[0];

    return {

        name:
            path.basename(
                projectPath
            ),

        path:
            projectPath,

        children:
            await readDirectory(
                projectPath
            )

    };

}

async function readDirectory(
    directoryPath
) {

    const entries =
        await fs.readdir(

            directoryPath,

            {
                withFileTypes: true
            }

        );

    const contents = [];

    for (
        const entry
        of entries
    ) {

        const fullPath =
            path.join(

                directoryPath,

                entry.name

            );

        if (
            entry.isDirectory()
        ) {

            contents.push({

                name:
                    entry.name,

                path:
                    fullPath,

                type:
                    "directory",

                isExpanded:
                    false,

                children:
                    await readDirectory(
                        fullPath
                    )

            });

        }

        else {

            contents.push({

                name:
                    entry.name,

                path:
                    fullPath,

                type:
                    "file"

            });

        }

    }

    contents.sort(

        (
            a,
            b
        ) => {

            if (
                a.type ===
                b.type
            ) {

                return a.name.localeCompare(
                    b.name
                );

            }

            return a.type ===
                "directory"
                ? -1
                : 1;

        }

    );

    return contents;

}

module.exports = {

    openFolder,

    readDirectory

};