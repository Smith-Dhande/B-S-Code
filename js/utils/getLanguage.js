function getLanguage(fileName) {

    const extension = fileName.split(".").pop().toLowerCase();

    switch (extension) {

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

        default:
            return "plaintext";
    }
}

export { getLanguage };