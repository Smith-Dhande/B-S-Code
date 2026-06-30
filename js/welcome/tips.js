const tips = [
    "Press Ctrl+P to quickly open files.",
    "Use Ctrl+Shift+P to access commands.",
    "Git decorations appear automatically in the Explorer panel.",
    "Click on any modified file in the Source Control changes list to view it in Monaco.",
    "Toggle between terminal and editor sessions using the terminal icon.",
    "Your edits are saved automatically on disk when pressing Ctrl+S.",
    "Initialize git repositories directly from the Source Control view.",
    "Publish to GitHub from the Git menu using standard secure OAuth authentication.",
    "Verify that Ollama is active locally to unlock AI code assistant capabilities."
];

function getRandomTip() {
    const index = Math.floor(Math.random() * tips.length);
    return tips[index];
}

export { getRandomTip };
