import { state }
from "../state.js";

import { updateUI }
from "../ui/updateUI.js";

import {
    getModels
}
from "./ollama.js";

async function loadModels() {

    const modelSelector =
        document.getElementById(
            "model-selector"
        );

    const models =
        await getModels();

    modelSelector.innerHTML = "";

    models.forEach(
        (model) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                model.name;

            option.textContent =
                model.name;

            modelSelector.appendChild(
                option
            );

        }
    );

    const savedModel =
        sessionStorage.getItem(
            "currentModel"
        );

    if (
        savedModel &&
        models.some(
            model =>
                model.name ===
                savedModel
        )
    ) {

        modelSelector.value =
            savedModel;

        state.currentModel =
            savedModel;

    }

    modelSelector.addEventListener(
        "change",
        () => {

            state.currentModel =
                modelSelector.value;

            sessionStorage.setItem(
                "currentModel",
                state.currentModel
            );

            updateUI();

        }
    );

    updateUI();

}

export {
    loadModels
};