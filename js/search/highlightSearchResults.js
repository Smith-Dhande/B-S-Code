import {getEditor}from "../editor/monaco.js";

let decorations = [];

function highlightSearchResults(
    searchTerm
) {

    const editor =
        getEditor();

    if (
        !editor
    ) {
        return;
    }

    const model =
        editor.getModel();

    if (
        !searchTerm
    ) {

        decorations =
            editor.deltaDecorations(
                decorations,
                []
            );

        return;

    }

    const matches =
        model.findMatches(
            searchTerm,
            true,
            false,
            false,
            null,
            true
        );

    decorations =
        editor.deltaDecorations(
            decorations,
            matches.map(
                (
                    match
                ) => ({
                    range:
                        match.range,

                    options: {

                        inlineClassName:
                            "search-highlight"

                    }

                })
            )
        );

}

export {
    highlightSearchResults
};