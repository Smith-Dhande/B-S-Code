import { updateUI } from "../ui/updateUI.js";
import {
getModels
} from "./ollama.js";

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
updateUI();

}

export { loadModels };
