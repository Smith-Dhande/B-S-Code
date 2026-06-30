import { state }
from "../state.js";

import { getFolderContent , getExpandedFolders } from "../filesystem/openFolder.js";

import { openFile } from "../editor/openFile.js";

import { createFileByName } from "./createFile.js";

import { createFolderByName } from "./createFolder.js";

import { updateGitStatus } from "../git/gitStatus.js";

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

            // Git decorations and badges
            const itemPath = item.path.replace(/\\/g, '/');
            let gitClass = '';
            let gitBadge = '';

            if (item.type === 'file') {
                const gitInfo = state.gitStatus && state.gitStatus.find(f => f.path.replace(/\\/g, '/').toLowerCase() === itemPath.toLowerCase());
                if (gitInfo) {
                    console.log("Git Match Found in Explorer:", itemPath, "Status:", gitInfo.status);
                    if (gitInfo.status === 'M') {
                        gitClass = 'git-m';
                        gitBadge = '<span class="git-explorer-badge git-badge-m">M</span>';
                    } else if (gitInfo.status === 'U') {
                        gitClass = 'git-u';
                        gitBadge = '<span class="git-explorer-badge git-badge-u">U</span>';
                    } else if (gitInfo.status === 'A') {
                        gitClass = 'git-a';
                        gitBadge = '<span class="git-explorer-badge git-badge-a">A</span>';
                    } else if (gitInfo.status === 'D') {
                        gitClass = 'git-d';
                        gitBadge = '<span class="git-explorer-badge git-badge-d">D</span>';
                    }
                }
            } else if (item.type === 'directory') {
                const childrenGit = state.gitStatus && state.gitStatus.filter(f => f.path.replace(/\\/g, '/').toLowerCase().startsWith(itemPath.toLowerCase() + '/'));
                if (childrenGit && childrenGit.length > 0) {
                    if (childrenGit.some(f => f.status === 'M')) {
                        gitClass = 'git-child-m';
                    } else if (childrenGit.some(f => f.status === 'A')) {
                        gitClass = 'git-child-a';
                    } else if (childrenGit.some(f => f.status === 'U')) {
                        gitClass = 'git-child-u';
                    }
                }
            }

            if (gitClass) {
                explorerItem.classList.add(gitClass);
            }

            explorerItem.style.paddingLeft =
                `${level * 20}px`;

            explorerItem.innerHTML = `
    ${
        item.type === "directory"
            ? `
                <span class="folder-arrow">
                    ${
                        item.isExpanded
                            ? "⌄"
                            : ">"
                    }
                </span>

                <span class="folder-icon">
                    📁
                </span>
            `
            : `
                <span class="file-spacer">
                </span>

                <span class="file-icon">
                    📄
                </span>
            `
    }

    <span class="explorer-item-name">
        ${item.name}
    </span>
    ${gitBadge}
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

               let targetFolder =
    state.selectedFolder;

if (
    state.selectedExplorerItem
) {

    if (
        state.selectedExplorerItem.type ===
        "directory"
    ) {

        targetFolder =
            state.selectedExplorerItem.handle;

    }

    else {

        targetFolder =
            state.selectedExplorerItem.parentHandle;

    }

}

if (
    state.isCreatingFile
) {

    await createFileByName(
        name,
        targetFolder
    );

}

if (
    state.isCreatingFolder
) {

    await createFolderByName(
        name,
        targetFolder
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

            const expandedFolders =
    getExpandedFolders(
        state.folderStructure
    );

state.folderStructure =
    await getFolderContent(
        state.selectedFolder,
        "",
        expandedFolders
    );

            renderExplorer();
            updateGitStatus();

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