import { state } from "../state.js";
import { getRecentProjects, removeRecentProject, loadRecentHandle } from "./recentProjects.js";
import { getRandomTip } from "./tips.js";
import { runEnvironmentChecks } from "./environmentCheck.js";
import { getFolderContent } from "../filesystem/openFolder.js";
import { renderExplorer } from "../explorer/renderExplorer.js";
import { updateGitStatus } from "../git/gitStatus.js";
import { updateUI } from "../ui/updateUI.js";
import { saveFolderHandle } from "../filesystem/folderHandleStorage.js";

function showWelcomeScreen() {
    const welcomeScreen = document.getElementById("welcome-screen");
    const editorDiv = document.getElementById("editor");
    if (!welcomeScreen || !editorDiv) return;

    // Switch view state
    welcomeScreen.hidden = false;
    editorDiv.style.display = "none";

    // Set welcome screen layout html
    renderWelcomeLayout(welcomeScreen);

    // Load and render dynamic sections
    renderTip();
    renderRecentProjects();
    renderEnvironmentChecks();

    // Bind action listeners
    bindActions();
}

function hideWelcomeScreen() {
    const welcomeScreen = document.getElementById("welcome-screen");
    const editorDiv = document.getElementById("editor");
    if (!welcomeScreen || !editorDiv) return;

    welcomeScreen.hidden = true;
    editorDiv.style.display = "block";

    // Layout Monaco if initialized
    const editorInstance = window.getEditor ? window.getEditor() : null;
    if (editorInstance) {
        editorInstance.layout();
    }
}

function renderWelcomeLayout(container) {
    container.innerHTML = `
        <div class="welcome-container">
            <div class="welcome-main">
                <div class="welcome-header">
                    <img src="assets/logos/BSCodeLogo.png" alt="BS Code Logo" class="welcome-logo">
                    <h1>Welcome to BS Code</h1>
                    <p class="welcome-subtitle">A lightweight AI-powered code editor with integrated Git, GitHub, Terminal and Monaco Editor.</p>
                </div>
                
                <div class="welcome-grid">
                    <!-- Left Column: Start & Recent -->
                    <div class="welcome-column">
                        <div class="welcome-section">
                            <h2>Start</h2>
                            <div class="welcome-actions">
                                <button id="welcome-open-folder" class="welcome-btn">
                                    <i class="fa-solid fa-folder-open"></i> Open Folder
                                </button>
                                <button id="welcome-clone-repo" class="welcome-btn">
                                    <i class="fa-brands fa-github"></i> Clone Repository
                                </button>
                                <button id="welcome-new-file" class="welcome-btn">
                                    <i class="fa-solid fa-file-circle-plus"></i> New File
                                </button>
                            </div>
                        </div>
                        
                        <div class="welcome-section">
                            <h2>Recent Projects</h2>
                            <div id="welcome-recent-list" class="recent-list">
                                <div class="welcome-loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading recent projects...</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Column: Check & Tips -->
                    <div class="welcome-column">
                        <div class="welcome-section">
                            <h2>Environment Check</h2>
                            <div id="welcome-env-check" class="env-check-container">
                                <div class="welcome-loading"><i class="fa-solid fa-spinner fa-spin"></i> Verifying development environment...</div>
                            </div>
                        </div>
                        
                        <div class="welcome-section">
                            <h2>Productivity Tip</h2>
                            <div id="welcome-tip" class="tip-container">
                                <!-- Tip text here -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="welcome-footer">
                    <h2>Quick Start</h2>
                    <div class="quick-start-grid">
                        <div class="quick-card" id="quick-new-proj">
                            <i class="fa-solid fa-folder-plus"></i>
                            <h3>New Project</h3>
                            <p>Create a fresh workspace directory</p>
                        </div>
                        <div class="quick-card" id="quick-open-proj">
                            <i class="fa-solid fa-folder-open"></i>
                            <h3>Open Project</h3>
                            <p>Open an existing project folder</p>
                        </div>
                        <div class="quick-card" id="quick-clone">
                            <i class="fa-brands fa-github"></i>
                            <h3>Clone from GitHub</h3>
                            <p>Download a remote repository</p>
                        </div>
                        <div class="quick-card" id="quick-shortcuts">
                            <i class="fa-solid fa-keyboard"></i>
                            <h3>Keyboard Shortcuts</h3>
                            <p>Learn editor hotkeys</p>
                        </div>
                        <div class="quick-card" id="quick-docs">
                            <i class="fa-solid fa-book"></i>
                            <h3>Documentation</h3>
                            <p>Read BS Code guides</p>
                        </div>
                        <div class="quick-card" id="quick-issue">
                            <i class="fa-solid fa-bug"></i>
                            <h3>Report Issue</h3>
                            <p>Submit bugs or request features</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTip() {
    const tipContainer = document.getElementById("welcome-tip");
    if (!tipContainer) return;
    const tip = getRandomTip();
    tipContainer.innerHTML = `
        <div class="tip-content">
            <i class="fa-solid fa-lightbulb tip-icon"></i>
            <p>"${tip}"</p>
        </div>
    `;
}

async function renderRecentProjects() {
    const listContainer = document.getElementById("welcome-recent-list");
    if (!listContainer) return;

    const projects = getRecentProjects();
    if (projects.length === 0) {
        listContainer.innerHTML = `<div class="recent-empty">No recent projects.</div>`;
        return;
    }

    listContainer.innerHTML = projects.map(p => {
        const timeAgo = formatTimeAgo(p.lastOpened);
        const gitBadge = p.git ? `<i class="fa-brands fa-git-alt recent-git-icon" title="Git Repository"></i>` : '';
        return `
            <div class="recent-item" data-path="${p.path}">
                <div class="recent-details">
                    <div class="recent-name-row">
                        <span class="recent-name">${p.name}</span>
                        ${gitBadge}
                    </div>
                    <span class="recent-path" title="${p.path}">${p.path}</span>
                    <span class="recent-time">${timeAgo}</span>
                </div>
                <button class="recent-remove-btn" title="Remove from Recent">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
    }).join('');

    // Bind click events for opening projects
    listContainer.querySelectorAll(".recent-details").forEach(el => {
        el.onclick = async () => {
            const path = el.parentElement.getAttribute("data-path");
            await openRecentWorkspace(path);
        };
    });

    // Bind click events for removing projects
    listContainer.querySelectorAll(".recent-remove-btn").forEach(el => {
        el.onclick = async (e) => {
            e.stopPropagation();
            const path = el.parentElement.getAttribute("data-path");
            await removeRecentProject(path);
            renderRecentProjects();
        };
    });
}

async function openRecentWorkspace(path) {
    const handle = await loadRecentHandle(path);
    if (!handle) {
        alert("Directory handle not cached. Please open the folder using the picker.");
        document.getElementById("open-folder-button").click();
        return;
    }

    try {
        const permission = await handle.requestPermission({ mode: "readwrite" });
        if (permission === "granted") {
            state.selectedFolder = handle;
            state.projectPath = path;

            localStorage.setItem("projectPath", path);
            sessionStorage.setItem("projectName", handle.name);

            await saveFolderHandle(handle);
            await window.terminal.changeDirectory(path);
            await updateGitStatus();

            state.folderStructure = await getFolderContent(handle);

            hideWelcomeScreen();
            updateUI();
            renderExplorer();
        } else {
            alert("Permission denied to access recent folder.");
        }
    } catch (e) {
        console.error("Failed to restore recent folder:", e);
        alert(`Failed to open recent project: ${e.message || e}`);
    }
}

async function renderEnvironmentChecks() {
    const checkContainer = document.getElementById("welcome-env-check");
    if (!checkContainer) return;

    const checks = await runEnvironmentChecks();
    
    checkContainer.innerHTML = Object.keys(checks).map(key => {
        const check = checks[key];
        const icon = check.status 
            ? `<i class="fa-solid fa-circle-check env-status-icon success"></i>`
            : `<i class="fa-solid fa-circle-xmark env-status-icon error"></i>`;
        
        const actionBtn = check.status
            ? ''
            : `<button class="env-action-btn" data-key="${key}">${check.actionLabel}</button>`;

        return `
            <div class="env-check-item">
                <div class="env-info-row">
                    ${icon}
                    <span class="env-label">${check.label}</span>
                </div>
                ${actionBtn}
            </div>
        `;
    }).join('');

    // Bind action buttons
    checkContainer.querySelectorAll(".env-action-btn").forEach(btn => {
        btn.onclick = async () => {
            const key = btn.getAttribute("data-key");
            const check = checks[key];
            if (check.type === "url") {
                window.github.openExternal(check.target);
            } else if (check.target === "internet") {
                btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Checking...`;
                setTimeout(() => renderEnvironmentChecks(), 500);
            } else if (check.target === "github") {
                const gitViewBtn = document.getElementById("git-view-btn");
                if (gitViewBtn) {
                    gitViewBtn.click();
                    setTimeout(() => {
                        const publishBtn = document.getElementById("git-publish-btn");
                        if (publishBtn) publishBtn.click();
                    }, 200);
                }
            }
        };
    });
}

function bindActions() {
    // Open Folder
    document.getElementById("welcome-open-folder").onclick = () => {
        document.getElementById("open-folder-button").click();
    };

    // Clone Repository
    document.getElementById("welcome-clone-repo").onclick = () => {
        const gitViewBtn = document.getElementById("git-view-btn");
        if (gitViewBtn) {
            gitViewBtn.click();
            setTimeout(() => {
                const gitCloneBtn = document.getElementById("git-clone-btn");
                if (gitCloneBtn) gitCloneBtn.click();
            }, 200);
        }
    };

    // New File
    document.getElementById("welcome-new-file").onclick = () => {
        document.getElementById("new-file-button").click();
    };

    // Quick Start Cards
    document.getElementById("quick-new-proj").onclick = () => {
        document.getElementById("open-folder-button").click();
    };
    document.getElementById("quick-open-proj").onclick = () => {
        document.getElementById("open-folder-button").click();
    };
    document.getElementById("quick-clone").onclick = () => {
        document.getElementById("welcome-clone-repo").click();
    };
    
    // Keyboard shortcuts card
    document.getElementById("quick-shortcuts").onclick = () => {
        showShortcutsModal();
    };

    // Docs
    document.getElementById("quick-docs").onclick = () => {
        window.github.openExternal("https://github.com/Smith-Dhande/B-S-Code");
    };

    // Issues
    document.getElementById("quick-issue").onclick = () => {
        window.github.openExternal("https://github.com/Smith-Dhande/B-S-Code/issues");
    };
}

function showShortcutsModal() {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
        <div class="welcome-modal-overlay">
            <div class="welcome-modal">
                <div class="welcome-modal-header">
                    <h2>Keyboard Shortcuts</h2>
                    <button id="close-shortcuts-modal" class="modal-close-btn">&times;</button>
                </div>
                <div class="welcome-modal-body">
                    <div class="shortcut-row"><span>Save File</span><kbd>Ctrl + S</kbd></div>
                    <div class="shortcut-row"><span>Quick File Open</span><kbd>Ctrl + P</kbd></div>
                    <div class="shortcut-row"><span>Git selected commit</span><kbd>Ctrl + Enter</kbd></div>
                    <div class="shortcut-row"><span>Toggle Terminal</span><kbd>Ctrl + \`</kbd></div>
                    <div class="shortcut-row"><span>Command Palette</span><kbd>Ctrl + Shift + P</kbd></div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("close-shortcuts-modal").onclick = () => {
        modalContainer.innerHTML = "";
    };

    modalContainer.querySelector(".welcome-modal-overlay").onclick = (e) => {
        if (e.target.classList.contains("welcome-modal-overlay")) {
            modalContainer.innerHTML = "";
        }
    };
}

function formatTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
}

export { showWelcomeScreen, hideWelcomeScreen };
