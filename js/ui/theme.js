function initializeTheme() {

    const themeButton =
        document.getElementById(
            "theme-toggle-button"
        );

    const savedTheme =
        localStorage.getItem(
            "theme"
        );

    if (
        savedTheme === "light"
    ) {

        document.body.classList.add(
            "light-theme"
        );

        themeButton.textContent =
            "Light Mode";

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

    themeButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-theme"
            );

            const isLight =
                document.body.classList.contains(
                    "light-theme"
                );

            localStorage.setItem(
                "theme",
                isLight
                    ? "light"
                    : "dark"
            );

            themeButton.textContent =
                isLight
                    ? "Light Mode"
                    : "Dark Mode";

            if (
                typeof monaco !==
                "undefined"
            ) {

                monaco.editor.setTheme(

                    isLight
                        ? "vs"
                        : "vs-dark"

                );

            }

        }
    );

}

export {
    initializeTheme
};