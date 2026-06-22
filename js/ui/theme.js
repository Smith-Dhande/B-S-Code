function getSystemTheme() {

    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches
        ? "dark"
        : "light";

}

function applyTheme(
    theme
) {

    const themeButton =
        document.getElementById(
            "theme-toggle-button"
        );

    if (
        theme === "light"
    ) {

        document.body.classList.add(
            "light-theme"
        );

        themeButton.textContent =
            "Dark Mode";

        if (
            typeof monaco !==
            "undefined"
        ) {

            monaco.editor.setTheme(
                "vs"
            );

        }

    }

    else {

        document.body.classList.remove(
            "light-theme"
        );

        themeButton.textContent =
            "Light Mode";

        if (
            typeof monaco !==
            "undefined"
        ) {

            monaco.editor.setTheme(
                "vs-dark"
            );

        }

    }

}

function initializeTheme() {

    const themeButton =
        document.getElementById(
            "theme-toggle-button"
        );

    const savedTheme =
        sessionStorage.getItem(
            "theme"
        );

    const initialTheme =
        savedTheme ||
        getSystemTheme();

    applyTheme(
        initialTheme
    );

    themeButton.addEventListener(
        "click",
        () => {

            const isLight =
                document.body.classList.contains(
                    "light-theme"
                );

            const nextTheme =
                isLight
                    ? "dark"
                    : "light";

            sessionStorage.setItem(
                "theme",
                nextTheme
            );

            applyTheme(
                nextTheme
            );

        }
    );

    const mediaQuery =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

    mediaQuery.addEventListener(
        "change",
        (event) => {

            const savedTheme =
                sessionStorage.getItem(
                    "theme"
                );

            if (
                savedTheme
            ) {

                return;

            }

            applyTheme(
                event.matches
                    ? "dark"
                    : "light"
            );

        }
    );

}

export {
    initializeTheme,
    applyTheme
};