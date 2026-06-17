let editor;

function createEditor() {

    require.config({
        paths: {
            vs: "./vendor/monaco/vs"
        }
    });

    require(["vs/editor/editor.main"], function () {

        editor = monaco.editor.create(
            document.getElementById("editor"),
            {
                value: "",
                language: "javascript",
                theme: "vs-dark",
                automaticLayout: true
            }
        );

    });

}

function getEditor() {
    return editor;
}

export { createEditor, getEditor };