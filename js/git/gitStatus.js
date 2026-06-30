import { state } from "../state.js";
import { renderExplorer } from "../explorer/renderExplorer.js";
import { openFile } from "../editor/openFile.js";

let statusPollerId = null;

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

async function updateGitStatus() {
    const gitPanel = document.getElementById("git-panel");
    if (!gitPanel) return;
    
    const gitSection = gitPanel.querySelector(".git-section");
    if (!gitSection) return;

    if (!state.projectPath) {
        renderEmptyState(gitSection, "Open a Git repository to begin tracking changes.");
        state.gitRepository = false;
        state.gitBranch = null;
        state.gitStatus = [];
        return;
    }

    try {
        const isRepo = await window.git.isRepository(state.projectPath);
        
        if (!isRepo) {
            renderEmptyState(gitSection, `No Git repository detected in the project.<br><span style="font-size: 11px; opacity: 0.7; margin-top: 8px; display: block;">Run "git init" in the terminal to initialize.</span>`);
            state.gitRepository = false;
            state.gitBranch = null;
            state.gitStatus = [];
            // Re-render Explorer to clear decorations
            renderExplorer();
            return;
        }

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
        commitBtn.disabled = true;
        commitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Committing...`;
        
        try {
            if (window.git.commit) {
                await window.git.commit(state.projectPath, msg);
            } else {
                // Fallback to terminal execute if background commit is not supported
                await window.terminal.execute(`git add . && git commit -m "${msg.replace(/"/g, '\\"')}"`);
            }
            if (commitMsgElement) {
                commitMsgElement.value = "";
            }
            await updateGitStatus();
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
        element.onclick = () => {
            const relPath = element.getAttribute("data-path");
            // Check if file is deleted (status 'D')
            const isDeleted = deleted.some(d => d.path === relPath);
            if (isDeleted) {
                console.log("Cannot open deleted file:", relPath);
                return;
            }
            
            const item = findItemByPath(state.folderStructure, relPath);
            if (item) {
                openFile(item);
            } else {
                console.log("File handle not found in explorer tree for:", relPath);
            }
        };
    });
}

function startGitStatusPoller() {
    if (statusPollerId) {
        clearInterval(statusPollerId);
    }
    // Poll every 5 seconds
    statusPollerId = setInterval(() => {
        if (state.projectPath) {
            updateGitStatus();
        }
    }, 5000);
}

export {
    updateGitStatus,
    startGitStatusPoller,
    parseGitStatus
};
