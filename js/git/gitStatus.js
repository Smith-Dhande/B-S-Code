import { state } from "../state.js";
import { renderExplorer } from "../explorer/renderExplorer.js";
import { openFile } from "../editor/openFile.js";

let statusPollerId = null;
let isInteractiveWorkflowActive = false; // Prevents background polling from resetting interactive UI states

function parseGitStatus(statusOutput) {
    if (!statusOutput) return [];
    const lines = statusOutput.split('\n');
    const statusItems = [];
    
    for (const line of lines) {
        if (!line.trim()) continue;
        const code = line.slice(0, 2);
        let filePath = line.slice(3).trim();
        
        // Remove surrounding quotes if git output has them (for spaces/special chars)
        if (filePath.startsWith('"') && filePath.endsWith('"')) {
            filePath = filePath.slice(1, -1);
        }
        
        // Handle renamed files: old_path -> new_path
        if (code.includes('R')) {
            const parts = filePath.split(' -> ');
            if (parts.length === 2) {
                filePath = parts[1];
            }
        }
        
        let status = 'M'; // Default to Modified
        const indexCode = code[0];
        const worktreeCode = code[1];
        
        if (indexCode === '?' && worktreeCode === '?') {
            status = 'U'; // Untracked
        } else if (indexCode === 'A' || worktreeCode === 'A') {
            status = 'A'; // Added
        } else if (indexCode === 'D' || worktreeCode === 'D') {
            status = 'D'; // Deleted
        } else if (indexCode === 'M' || worktreeCode === 'M') {
            status = 'M'; // Modified
        }
        
        statusItems.push({
            path: filePath,
            status: status
        });
    }
    
    return statusItems;
}

function findItemByPath(items, relativePath) {
    for (const item of items) {
        // Normalize paths (replace backslashes with forward slashes)
        const normalizedItemPath = item.path.replace(/\\/g, '/');
        const normalizedRelPath = relativePath.replace(/\\/g, '/');
        
        if (normalizedItemPath === normalizedRelPath) {
            return item;
        }
        if (item.type === 'directory' && item.children) {
            const found = findItemByPath(item.children, relativePath);
            if (found) return found;
        }
    }
    return null;
}

async function resolveFileItemFromPath(relPath) {
    try {
        if (!state.selectedFolder) return null;
        
        // Try finding it in the folderStructure first
        const item = findItemByPath(state.folderStructure, relPath);
        if (item) return item;
        
        // Fallback: Traverse directory handles
        const parts = relPath.replace(/\\/g, '/').split('/');
        let currentHandle = state.selectedFolder;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!part) continue;
            currentHandle = await currentHandle.getDirectoryHandle(part);
        }
        const fileName = parts[parts.length - 1];
        const fileHandle = await currentHandle.getFileHandle(fileName);
        
        return {
            name: fileName,
            path: relPath,
            type: "file",
            handle: fileHandle,
            parentHandle: currentHandle
        };
    } catch (e) {
        console.error("Failed to resolve file item from path:", relPath, e);
        return null;
    }
}

async function updateGitStatus() {
    if (isInteractiveWorkflowActive) {
        return; // Do not overwrite interactive flow views (auth/clone/publish)
    }

    const gitPanel = document.getElementById("git-panel");
    if (!gitPanel) return;
    
    const gitSection = gitPanel.querySelector(".git-section");
    if (!gitSection) return;

    // State 1: No folder open
    if (!state.projectPath) {
        renderNoFolderState(gitSection);
        state.gitRepository = false;
        state.gitBranch = null;
        state.gitStatus = [];
        return;
    }

    try {
        const isRepo = await window.git.isRepository(state.projectPath);
        
        // State 2: Folder is open but NOT a Git repository
        if (!isRepo) {
            renderNotGitRepositoryState(gitSection);
            state.gitRepository = false;
            state.gitBranch = null;
            state.gitStatus = [];
            // Re-render Explorer to clear decorations
            renderExplorer();
            return;
        }

        // State 3: Folder is a Git repository
        state.gitRepository = true;
        const branch = await window.git.getBranch(state.projectPath);
        state.gitBranch = branch || "detached";
        
        const statusOutput = await window.git.getStatus(state.projectPath);
        const parsedStatus = parseGitStatus(statusOutput);
        
        // Deep compare to avoid unnecessary DOM updates & layout cycles
        const statusChanged = JSON.stringify(state.gitStatus) !== JSON.stringify(parsedStatus);
        state.gitStatus = parsedStatus;

        renderGitInterface(gitSection, branch, parsedStatus);
        
        if (statusChanged) {
            renderExplorer();
        }
    } catch (err) {
        console.error("Error updating Git status:", err);
        renderEmptyState(gitSection, `Error querying git status: ${err.message || err}`);
    }
}

// Global hook for activity bar or folder changes
window.updateGitStatus = updateGitStatus;

function renderEmptyState(container, message) {
    container.classList.remove("repo-detected");
    container.innerHTML = `
        <div class="git-empty-state">
            <i class="fa-solid fa-code-branch"></i>
            <h3>Source Control</h3>
            <p>${message}</p>
        </div>
    `;
}

// Render state when no folder is open
function renderNoFolderState(container) {
    container.classList.remove("repo-detected");
    container.innerHTML = `
        <div class="git-empty-state">
            <i class="fa-solid fa-folder-open"></i>
            <h3>Source Control</h3>
            <p>No folder is open.</p>
            <button id="git-open-folder-btn" class="git-action-btn">
                Open Folder
            </button>
            <button id="git-clone-btn" class="git-action-btn git-action-btn-secondary">
                Clone Repository
            </button>
        </div>
    `;
    
    document.getElementById("git-open-folder-btn").onclick = () => {
        document.getElementById("open-folder-button").click();
    };
    
    document.getElementById("git-clone-btn").onclick = () => showCloneForm(container);
}

function showCloneForm(container) {
    isInteractiveWorkflowActive = true;
    container.innerHTML = `
        <div class="git-publish-form">
            <h3>Clone Repository</h3>
            <div class="git-form-group">
                <label for="git-clone-url">Repository URL</label>
                <input type="text" id="git-clone-url" placeholder="https://github.com/user/repo.git">
            </div>
            <button id="git-clone-submit-btn" class="git-action-btn">
                Clone
            </button>
            <button id="git-clone-cancel-btn" class="git-action-btn git-action-btn-secondary">
                Cancel
            </button>
        </div>
    `;
    
    document.getElementById("git-clone-cancel-btn").onclick = () => {
        isInteractiveWorkflowActive = false;
        renderNoFolderState(container);
    };
    
    const submitBtn = document.getElementById("git-clone-submit-btn");
    submitBtn.onclick = async () => {
        const repoUrl = document.getElementById("git-clone-url").value.trim();
        if (!repoUrl) {
            alert("Repository URL cannot be empty.");
            return;
        }
        
        if (!repoUrl.startsWith("http://") && !repoUrl.startsWith("https://") && !repoUrl.startsWith("git@") && !repoUrl.startsWith("ssh://")) {
            alert("Invalid repository URL. Must start with http://, https://, ssh://, or git@.");
            return;
        }
        
        try {
            const project = await window.filesystem.openFolder();
            if (!project || !project.path) return;
            
            const repoName = getRepoNameFromUrl(repoUrl);
            
            container.innerHTML = `
                <div class="git-empty-state">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <h3>Cloning Repository</h3>
                    <p>Cloning ${repoUrl}...</p>
                </div>
            `;
            
            await window.git.clone(repoUrl, project.path);
            
            alert(`Successfully cloned repository to ${project.path}/${repoName}!\nPlease select this folder to open it in BS Code.`);
            isInteractiveWorkflowActive = false;
            document.getElementById("open-folder-button").click();
        } catch (err) {
            alert(`Clone failed: ${err.message || err}`);
            isInteractiveWorkflowActive = false;
            renderNoFolderState(container);
        }
    };
}

// Render state when folder is open but not git repo
function renderNotGitRepositoryState(container) {
    container.classList.remove("repo-detected");
    container.innerHTML = `
        <div class="git-empty-state">
            <i class="fa-solid fa-code-branch"></i>
            <h3>Source Control</h3>
            <p>This folder is not a Git repository.</p>
            <button id="git-init-btn" class="git-action-btn">
                Initialize Repository
            </button>
            <button id="git-publish-btn" class="git-action-btn git-action-btn-secondary">
                Publish to GitHub
            </button>
        </div>
    `;
    
    document.getElementById("git-init-btn").onclick = handleGitInit;
    document.getElementById("git-publish-btn").onclick = handleGitPublish;
}

function getRepoNameFromUrl(url) {
    if (!url) return "";
    const parts = url.split("/");
    let lastPart = parts[parts.length - 1];
    if (lastPart.endsWith(".git")) {
        lastPart = lastPart.slice(0, -4);
    }
    return lastPart || "cloned-repo";
}

async function handleGitInit() {
    try {
        await window.git.init(state.projectPath);
        await updateGitStatus();
    } catch (err) {
        alert(`Failed to initialize git repository: ${err}`);
    }
}

async function handleGitPublish() {
    isInteractiveWorkflowActive = true;
    const gitPanel = document.getElementById("git-panel");
    const gitSection = gitPanel.querySelector(".git-section");
    
    gitSection.innerHTML = `
        <div class="git-empty-state">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <h3>Checking Authentication</h3>
            <p>Checking GitHub credentials...</p>
        </div>
    `;
    
    try {
        const user = await window.github.checkAuth();
        if (user) {
            await showPublishForm(gitSection, user);
        } else {
            await startOAuthFlow(gitSection);
        }
    } catch (err) {
        alert(`Publish check failed: ${err}`);
        isInteractiveWorkflowActive = false;
        await updateGitStatus();
    }
}

async function startOAuthFlow(container) {
    try {
        const codeData = await window.github.requestDeviceCode();
        let isAuthCancelled = false;
        
        container.innerHTML = `
            <div class="git-auth-container">
                <h3>GitHub Authentication</h3>
                <p>Please authorize BS Code to access your GitHub account.</p>
                <div class="git-auth-code">${codeData.user_code}</div>
                <p>Copy the code above and enter it at:</p>
                <a href="#" id="git-auth-link" style="color: var(--accent-color); word-break: break-all; text-decoration: none;">${codeData.verification_uri}</a>
                <button id="git-open-browser-btn" class="git-action-btn" style="margin-top: 10px;">
                    Open Browser
                </button>
                <button id="git-cancel-auth-btn" class="git-action-btn git-action-btn-secondary">
                    Cancel
                </button>
                <div style="margin-top: 15px; font-size: 11px; color: var(--text-muted); text-align: center;">
                    <i class="fa-solid fa-spinner fa-spin"></i> Waiting for authorization...
                </div>
            </div>
        `;
        
        document.getElementById("git-cancel-auth-btn").onclick = () => {
            isAuthCancelled = true;
            isInteractiveWorkflowActive = false;
            updateGitStatus();
        };
        
        const openBrowser = () => {
            window.github.openExternal(codeData.verification_uri);
        };
        
        document.getElementById("git-open-browser-btn").onclick = openBrowser;
        document.getElementById("git-auth-link").onclick = (e) => {
            e.preventDefault();
            openBrowser();
        };
        
        const pollResult = await window.github.pollForToken(codeData.device_code, codeData.interval);
        if (isAuthCancelled) return;
        
        if (pollResult.success) {
            alert(`Authenticated successfully as ${pollResult.user.login}!`);
            await showPublishForm(container, pollResult.user);
        } else {
            alert(`Authentication failed: ${pollResult.error}`);
            isInteractiveWorkflowActive = false;
            await updateGitStatus();
        }
    } catch (err) {
        alert(`Authentication error: ${err}`);
        isInteractiveWorkflowActive = false;
        await updateGitStatus();
    }
}

async function showPublishForm(container, user) {
    const defaultRepoName = state.projectPath ? state.projectPath.split(/[\\/]/).pop() : "my-project";
    
    container.innerHTML = `
        <div class="git-publish-form">
            <h3>Publish Repository</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                <span>Logged in as: <strong>@${user.login}</strong></span>
                <a href="#" id="git-logout-btn" style="color: var(--accent-color); text-decoration: none; font-size: 11px;">Sign Out</a>
            </p>
            <div class="git-form-group">
                <label for="git-repo-name">Repository Name</label>
                <input type="text" id="git-repo-name" value="${defaultRepoName}">
            </div>
            <div class="git-form-group">
                <label for="git-repo-visibility">Visibility</label>
                <select id="git-repo-visibility">
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>
            </div>
            <button id="git-publish-submit-btn" class="git-action-btn">
                Publish Project
            </button>
            <button id="git-publish-cancel-btn" class="git-action-btn git-action-btn-secondary">
                Cancel
            </button>
        </div>
    `;
    
    document.getElementById("git-logout-btn").onclick = async (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to sign out from GitHub?")) {
            await window.github.logout();
            isInteractiveWorkflowActive = false;
            await updateGitStatus();
        }
    };
    
    document.getElementById("git-publish-cancel-btn").onclick = () => {
        isInteractiveWorkflowActive = false;
        updateGitStatus();
    };
    
    const submitBtn = document.getElementById("git-publish-submit-btn");
    submitBtn.onclick = async () => {
        const repoName = document.getElementById("git-repo-name").value.trim();
        const visibility = document.getElementById("git-repo-visibility").value;
        
        if (!repoName) {
            alert("Repository name cannot be empty.");
            return;
        }
        
        const repoNameRegex = /^[a-zA-Z0-9._-]+$/;
        if (!repoNameRegex.test(repoName)) {
            alert("Invalid repository name. Only alphanumeric characters, hyphens, underscores, and dots are allowed.");
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Publishing...`;
        
        try {
            const isPrivate = visibility === "private";
            const repoData = await window.github.createRepo(repoName, isPrivate);
            await window.github.publishProject(state.projectPath, repoName, isPrivate, repoData.clone_url);
            alert(`Project published successfully to GitHub!`);
            isInteractiveWorkflowActive = false;
            await updateGitStatus();
        } catch (err) {
            alert(`Failed to publish: ${err.message || err}`);
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Publish Project";
        }
    };
}

function renderGitInterface(container, branch, files) {
    // Preserve textarea state before rendering new elements
    const commitMsgInput = document.getElementById("git-commit-message");
    const savedMessage = commitMsgInput ? commitMsgInput.value : "";
    const hadFocus = commitMsgInput && document.activeElement === commitMsgInput;
    const selectionStart = commitMsgInput ? commitMsgInput.selectionStart : 0;
    const selectionEnd = commitMsgInput ? commitMsgInput.selectionEnd : 0;

    container.classList.add("repo-detected");
    
    // Group files by status
    const added = files.filter(f => f.status === 'A');
    const modified = files.filter(f => f.status === 'M');
    const deleted = files.filter(f => f.status === 'D');
    const untracked = files.filter(f => f.status === 'U');
    
    const hasChanges = files.length > 0;
    
    let html = `
        <div class="git-repo-info">
            <div class="git-repo-title">
                <span>BS Code [${branch}]</span>
            </div>
        </div>
        
        <div class="git-commit-container">
            <textarea id="git-commit-message" placeholder="Message (Ctrl+Enter to commit)" rows="2"></textarea>
            <button id="git-commit-btn" class="git-commit-btn">
                <i class="fa-solid fa-check"></i> Commit
            </button>
        </div>
        
        <div class="git-changes-list">
    `;

    if (!hasChanges) {
        html += `
            <div class="git-no-changes">
                No changes detected in repository.
            </div>
        `;
    } else {
        const renderListSection = (title, items, statusClass, statusLetter) => {
            if (items.length === 0) return '';
            return `
                <div class="git-status-group">
                    <div class="git-status-group-header">
                        <span>${title}</span>
                        <span class="git-group-count">${items.length}</span>
                    </div>
                    <div class="git-status-group-items">
                        ${items.map(item => `
                            <div class="git-file-item" data-path="${item.path}">
                                <input type="checkbox" class="git-file-checkbox" data-path="${item.path}" checked onclick="event.stopPropagation();">
                                <i class="fa-solid fa-file-code git-file-icon"></i>
                                <span class="git-file-name" title="${item.path}">${item.path.split('/').pop()}</span>
                                <span class="git-file-path" title="${item.path}">${item.path}</span>
                                <span class="git-file-badge ${statusClass}">${statusLetter}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        };

        html += renderListSection("Added Files", added, "badge-added", "A");
        html += renderListSection("Modified Files", modified, "badge-modified", "M");
        html += renderListSection("Deleted Files", deleted, "badge-deleted", "D");
        html += renderListSection("Untracked Files", untracked, "badge-untracked", "U");
    }

    html += `</div>`;
    container.innerHTML = html;

    // Restore textarea state after innerHTML overwrite
    const newCommitMsgInput = document.getElementById("git-commit-message");
    if (newCommitMsgInput) {
        newCommitMsgInput.value = savedMessage;
        if (hadFocus) {
            newCommitMsgInput.focus();
            newCommitMsgInput.setSelectionRange(selectionStart, selectionEnd);
        }
    }

    // Attach event listeners
    const commitBtn = document.getElementById("git-commit-btn");
    const commitMsgElement = document.getElementById("git-commit-message");
    
    const handleCommit = async () => {
        const msg = commitMsgElement ? commitMsgElement.value.trim() : "";
        if (!msg) {
            alert("Please enter a commit message.");
            return;
        }
        
        const checkboxes = container.querySelectorAll(".git-file-checkbox:checked");
        const selectedFiles = Array.from(checkboxes).map(cb => cb.getAttribute("data-path"));
        
        if (selectedFiles.length === 0) {
            alert("Please select at least one file to commit.");
            return;
        }
        
        commitBtn.disabled = true;
        commitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Committing...`;
        
        try {
            await window.git.commitSelected(state.projectPath, msg, selectedFiles);
            if (commitMsgElement) {
                commitMsgElement.value = "";
            }
            await updateGitStatus();
            renderExplorer(); // Refresh Explorer decorations immediately
        } catch (err) {
            console.error("Commit failed:", err);
            alert(`Commit failed: ${err}`);
        } finally {
            commitBtn.disabled = false;
            commitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Commit`;
        }
    };

    if (commitBtn) {
        commitBtn.onclick = handleCommit;
    }
    
    if (commitMsgElement) {
        commitMsgElement.onkeydown = (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleCommit();
            }
        };
    }

    // Attach click events on file items
    const fileItems = container.querySelectorAll(".git-file-item");
    fileItems.forEach(element => {
        element.onclick = async () => {
            const relPath = element.getAttribute("data-path");
            // Check if file is deleted (status 'D')
            const isDeleted = deleted.some(d => d.path === relPath);
            if (isDeleted) {
                alert(`Cannot open deleted file: ${relPath}`);
                return;
            }
            
            const item = await resolveFileItemFromPath(relPath);
            if (item) {
                openFile(item);
            } else {
                console.log("File handle could not be resolved for:", relPath);
            }
        };
    });
}

function startGitStatusPoller() {
    if (statusPollerId) {
        clearInterval(statusPollerId);
    }
    // Poll every 10 seconds only if the Git view is active
    statusPollerId = setInterval(() => {
        if (state.projectPath && state.currentView === "git") {
            updateGitStatus();
        }
    }, 10000);
}

export {
    updateGitStatus,
    startGitStatusPoller,
    parseGitStatus
};
