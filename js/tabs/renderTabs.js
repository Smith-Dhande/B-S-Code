import { state } from "../state.js";

import { openFile }
from "../editor/openFile.js";

function renderTabs() {

    const tabsContainer =
        document.getElementById(
            "tabs-placeholder"
        );

    if (
        state.openTabs.length === 0
    ) {

        tabsContainer.innerHTML =
            "Ready to build something amazing?";

        return;

    }

    tabsContainer.innerHTML = "";

    state.openTabs.forEach(
        (tab) => {

            const tabElement =
                document.createElement(
                    "div"
                );

            tabElement.classList.add(
                "editor-tab"
            );

            if (
                state.activeFile &&
                state.activeFile.name ===
                tab.name
            ) {

                tabElement.classList.add(
                    "active-tab"
                );

            }

            tabElement.innerHTML = `
                <span class="tab-name">
                    ${tab.name}
                </span>

                <span class="tab-close">
                    ×
                </span>
            `;

            tabElement.addEventListener(
                "click",
                async () => {

                    await openFile(
                        tab
                    );

                }
            );

            const closeButton =
                tabElement.querySelector(
                    ".tab-close"
                );

            closeButton.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    closeTab(
                        tab
                    );

                }
            );

            tabsContainer.appendChild(
                tabElement
            );

        }
    );

}

function closeTab(
    tab
) {

    state.openTabs =
        state.openTabs.filter(
            (openTab) =>
                openTab.name !==
                tab.name
        );

    if (
        state.activeFile &&
        state.activeFile.name ===
        tab.name
    ) {

        if (
            state.openTabs.length > 0
        ) {

            state.activeFile =
                state.openTabs[
                    state.openTabs.length - 1
                ];

            openFile(
                state.activeFile
            );

        }

        else {

            state.activeFile =
                null;

        }

    }

    renderTabs();

}

export {
    renderTabs
};