function getLanguage(
    fileName
) {

    const extension =
        fileName
            .split(".")
            .pop()
            .toLowerCase();

    switch (
        extension
    ) {

        case "html":
            return "html";

        case "css":
            return "css";

        case "js":
            return "javascript";

        case "json":
            return "json";

        case "md":
            return "markdown";

        case "py":
            return "python";

        case "java":
            return "java";

        case "c":
            return "c";

        case "cpp":
            return "cpp";

        case "h":
            return "cpp";

        case "cs":
            return "csharp";

        case "xml":
            return "xml";

        case "sql":
            return "sql";

        case "php":
            return "php";

        default:
            return "plaintext";

    }

}

export {
    getLanguage
};