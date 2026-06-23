import { openFile } from "../editor/openFile.js";
import { getEditor } from "../editor/monaco.js";

function renderSearchResults(
    results
) {

    const container =
        document.getElementById(
            "search-results"
        );

    container.innerHTML =
        "";

    if (
        results.length === 0
    ) {

        container.innerHTML =
            "<p>No Results</p>";

        return;

    }

    results.forEach(
        (
            result
        ) => {

            const element =
                document.createElement(
                    "div"
                );

            element.classList.add(
                "search-result"
            );

            element.innerHTML = `
                <div>
                    📄 ${result.fileName}
                </div>

                <div>
                    Line ${result.lineNumber}
                </div>

                <div>
                    ${result.lineText}
                </div>
            `;

            element.addEventListener(
                "click",
                async () => {

                    await openFile(
    result.fileItem
);

setTimeout(
    () => {

        const editor =
            getEditor();

        if (
            !editor
        ) {
            return;
        }

        editor.revealLineInCenter(
            result.lineNumber
        );

        editor.setPosition({

            lineNumber:
                result.lineNumber,

            column: 1

        });

        editor.focus();

    },
    50
);
                }
            );

            container.appendChild(
                element
            );

        }
    );

}

export {
    renderSearchResults
};