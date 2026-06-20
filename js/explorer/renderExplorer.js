import { state }
from "../state.js";

import {
    getFolderContent
}
from "../filesystem/openFolder.js";

import { openFile }
from "../editor/openFile.js";

import { createFileByName }
from "./createFile.js";

import { createFolderByName }
from "./createFolder.js";

function renderExplorer() {

    const fileTreeContainer =
        document.getElementById(
            "file-tree-container"
        );

    fileTreeContainer.innerHTML =
        "";

    if (
        !state.selectedFolder &&
        state.folderStructure.length === 0
    ) {

        const emptyState =
            document.createElement(
                "div"
            );

        emptyState.classList.add(
            "explorer-empty-state"
        );

        emptyState.innerHTML = `
            <div style="
                padding:20px;
                text-align:center;
                opacity:0.7;
            ">
                <div style="
                    font-size:40px;
                    margin-bottom:10px;
                ">
                    📁
                </div>

                <div>
                    Project closed
                </div>

                <div style="
                    margin-top:8px;
                    font-size:12px;
                ">
                    Open Folder to continue
                </div>
            </div>
        `;

        fileTreeContainer.appendChild(
            emptyState
        );

        return;

    }

    fileTreeContainer.onclick =
        () => {

            state.selectedExplorerItem =
                null;

        };

    renderItems(
        state.folderStructure,
        fileTreeContainer,
        0
    );

    renderInlineCreationInput(
        fileTreeContainer
    );

}

function renderItems(
    items,
    parentElement,
    level
) {

    items.forEach(
        (item) => {

            const explorerItem =
                document.createElement(
                    "div"
                );

            explorerItem.classList.add(
                "explorer-item"
            );

            explorerItem.style.paddingLeft =
                `${level * 20}px`;

            explorerItem.innerHTML = `
                <span>
                    ${
                        item.type === "directory"
                            ? (
                                item.isExpanded
                                    ? "📂"
                                    : "📁"
                            )
                            : "📄"
                    }
                </span>

                <span>
                    ${item.name}
                </span>
            `;

            explorerItem.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    state.selectedExplorerItem =
                        item;

                    if (
                        item.type === "file"
                    ) {

                        openFile(
                            item
                        );

                    }

                    else {

                        item.isExpanded =
                            !item.isExpanded;

                        renderExplorer();

                    }

                }
            );

            parentElement.appendChild(
                explorerItem
            );

            if (
                item.type === "directory" &&
                item.isExpanded &&
                item.children &&
                item.children.length > 0
            ) {

                renderItems(
                    item.children,
                    parentElement,
                    level + 1
                );

            }

        }
    );

}

function renderInlineCreationInput(
    container
) {

    if (
        !state.isCreatingFile &&
        !state.isCreatingFolder
    ) {
        return;
    }

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.classList.add(
        "explorer-item"
    );

    const icon =
        state.isCreatingFolder
            ? "📁"
            : "📄";

    wrapper.innerHTML = `
        <span>${icon}</span>
        <input
            type="text"
            id="explorer-create-input"
            placeholder="${
                state.isCreatingFolder
                    ? "Folder name"
                    : "File name"
            }"
        >
    `;

    container.appendChild(
        wrapper
    );

    const input =
        wrapper.querySelector(
            "input"
        );

    input.focus();

    input.addEventListener(
        "keydown",
        async (event) => {

            if (
                event.key === "Escape"
            ) {

                state.isCreatingFile =
                    false;

                state.isCreatingFolder =
                    false;

                renderExplorer();

                return;

            }

            if (
                event.key !== "Enter"
            ) {
                return;
            }

            const name =
                input.value.trim();

            if (!name) {
                return;
            }

            try {

                if (
                    state.isCreatingFile
                ) {

                    await createFileByName(
                        name,
                        state.selectedFolder
                    );

                }

                if (
                    state.isCreatingFolder
                ) {

                    await createFolderByName(
                        name,
                        state.selectedFolder
                    );

                }

            } catch (error) {

                console.error(
                    error
                );

            }

            state.isCreatingFile =
                false;

            state.isCreatingFolder =
                false;

            state.folderStructure =
                await getFolderContent(
                    state.selectedFolder
                );

            renderExplorer();

        }
    );

    input.addEventListener(
        "blur",
        () => {

            state.isCreatingFile =
                false;

            state.isCreatingFolder =
                false;

            renderExplorer();

        }
    );

}

export {
    renderExplorer
};