const state = {
    selectedFolder: null,
    folderStructure: [],
    activeFile: null,
    selectedExplorerItem: null,
    currentFileContent: "",
    openTabs: [],
    currentModel: null,
    chatHistory: [],
    currentView:"explorer",
    isOpeningFile: false,
    isModified: false,
    modifiedFiles: [],
    isCreatingFile: false,
    isCreatingFolder: false
};

export { state };