import { state } from "../state.js";

import { replaceProject } from "./replaceProject.js";

import { searchProject } from "./searchProject.js";

import { renderSearchResults } from "./renderSearchResults.js";

import { highlightSearchResults } from "./highlightSearchResults.js";

function initializeSearch() {

    const replaceButton =
    document.getElementById(
        "replace-all-button"
    );

replaceButton.addEventListener(
    "click",
    async () => {

        const searchTerm =
            document.getElementById(
                "search-input"
            ).value.trim();

        const replaceTerm =
            document.getElementById(
                "replace-input"
            ).value;

        if (
            !searchTerm
        ) {

            
            return;

        }

        const count =
            await replaceProject(
                state.folderStructure,
                searchTerm,
                replaceTerm
            );

            
 searchInput.value = "";
 const replaceInput = document.getElementById("replace-input");
 replaceInput.value = "";
            const results =
    await searchProject(
        state.folderStructure,
        searchTerm
    );

renderSearchResults(
    results
);

       

    }
);

    const searchInput =
        document.getElementById(
            "search-input"
        );
    
    searchInput.addEventListener(
        "input",
        async () => {

            const searchTerm =
                searchInput.value.trim();

            if (
                !searchTerm
            ) {

                document.getElementById(
    "search-results"
).innerHTML = "";

highlightSearchResults(
    ""
);

return;

                return;

            }

            const results =
                await searchProject(
                    state.folderStructure,
                    searchTerm
                );

           renderSearchResults(
                results
            );

            highlightSearchResults(
                searchTerm
            );

        }
    );

}

export {
    initializeSearch
};