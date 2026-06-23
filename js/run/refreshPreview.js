import {
    runProject
}
from "./runProject.js";

async function refreshPreview() {

    await runProject();

}

export {
    refreshPreview
};