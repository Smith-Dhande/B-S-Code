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
        .getElementById(
            "git-panel"
        )
        .hidden =
        view !==
        "git";

    document
        .querySelectorAll(
            ".activity-button"
        )
        .forEach(
            (
                button
            ) => {

                button.classList.remove(
                    "active"
                );

            }
        );

    switch (
        view
    ) {

        case "explorer":

            document
                .getElementById(
                    "explorer-view-btn"
                )
                .classList.add(
                    "active"
                );

            break;

        case "search":

            document
                .getElementById(
                    "search-view-btn"
                )
                .classList.add(
                    "active"
                );

            break;

        case "git":

            document
                .getElementById(
                    "git-view-btn"
                )
                .classList.add(
                    "active"
                );

            break;

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

    document
        .getElementById(
            "git-view-btn"
        )
        .addEventListener(
            "click",
            () => {

                switchView(
                    "git"
                );

            }
        );

    switchView(
        "explorer"
    );

}

export {

    initializeActivityBar,
    switchView

};