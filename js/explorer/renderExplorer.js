import { state } from "../state.js";
import { openFile } from "../editor/openFile.js";

function renderExplorer() {


const fileTreeContainer =
    document.getElementById(
        "file-tree-container"
    );

fileTreeContainer.innerHTML = "";

fileTreeContainer.onclick = () => {

    state.selectedExplorerItem =
        null;

    console.log(
        "Root Selected"
    );

};

renderItems(
    state.folderStructure,
    fileTreeContainer,
    0
);


}

function renderItems(
items,
parentElement,
level
) {

items.forEach((item) => {

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

        <span>${item.name}</span>
    `;

    explorerItem.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            state.selectedExplorerItem =
                item;

            console.log(
                "Selected:",
                item.name
            );

            if (
                item.type === "file"
            ) {

                openFile(item);

            } else {

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

});

}

export { renderExplorer };
