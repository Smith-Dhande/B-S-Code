import { state }
from "../state.js";

function switchView(
    view
) {

    state.currentView =
        view;

    document
        .getElementById(
            "file-explorer"
        )
        .hidden =
        view !==
        "explorer";

    document
        .getElementById(
            "search-panel"
        )
        .hidden =
        view !==
        "search";

    document
        .querySelectorAll(
            ".activity-button"
        )
        .forEach(
            (button) => {

                button.classList.remove(
                    "active"
                );

            }
        );

    if (
        view ===
        "explorer"
    ) {

        document
            .getElementById(
                "explorer-view-btn"
            )
            .classList.add(
                "active"
            );

    }

    if (
        view ===
        "search"
    ) {

        document
            .getElementById(
                "search-view-btn"
            )
            .classList.add(
                "active"
            );

    }

}

function initializeActivityBar() {

    document
        .getElementById(
            "explorer-view-btn"
        )
        .addEventListener(
            "click",
            () => {

                switchView(
                    "explorer"
                );

            }
        );

    document
        .getElementById(
            "search-view-btn"
        )
        .addEventListener(
            "click",
            () => {

                switchView(
                    "search"
                );

            }
        );

}

export {
    initializeActivityBar,
    switchView
};