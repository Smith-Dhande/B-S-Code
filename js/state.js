const state = {
    selectedFolder: null,
    projectPath: null,
    folderStructure: [],
    activeFile: null,
    selectedExplorerItem: null,
    currentFileContent: "",
    previewWindow: null,
    previewUrl: null,
    openTabs: [],
    currentModel: null,
    chatHistory: [],
    currentView: "explorer",
    isOpeningFile: false,
    isModified: false,
    modifiedFiles: [],
    isCreatingFile: false,
    isCreatingFolder: false,
    gitBranch: null,
    gitRepository: false,
    gitStatus: []
};
export { state };