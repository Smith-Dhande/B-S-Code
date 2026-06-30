import { state } from "../state.js";
import { openDatabase } from "../filesystem/folderHandleStorage.js";

// localStorage key: "recent_projects"
// Structure: Array of { name: String, path: String, lastOpened: Number, git: Boolean }

function getRecentProjects() {
    try {
        const raw = localStorage.getItem("recent_projects");
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Error reading recent projects:", e);
        return [];
    }
}

async function addRecentProject(name, path, handle) {
    if (!path) return;
    try {
        // Save the DirectoryHandle in IndexedDB
        if (handle) {
            await saveRecentHandle(path, handle);
        }
        
        let projects = getRecentProjects();
        // Remove existing if duplicate
        projects = projects.filter(p => p.path !== path);
        
        // Check if git repo
        let isGit = false;
        try {
            isGit = await window.git.isRepository(path);
        } catch (e) {
            console.error("Failed to check if recent project is git:", e);
        }
        
        // Add to front
        projects.unshift({
            name: name || path.split(/[\\/]/).pop() || "project",
            path: path,
            lastOpened: Date.now(),
            git: isGit
        });
        
        // Limit to 10
        if (projects.length > 10) {
            const removed = projects.pop();
            if (removed && removed.path !== state.projectPath) {
                await deleteRecentHandle(removed.path);
            }
        }
        
        localStorage.setItem("recent_projects", JSON.stringify(projects));
    } catch (e) {
        console.error("Failed to add recent project:", e);
    }
}

async function removeRecentProject(path) {
    try {
        let projects = getRecentProjects();
        projects = projects.filter(p => p.path !== path);
        localStorage.setItem("recent_projects", JSON.stringify(projects));
        await deleteRecentHandle(path);
    } catch (e) {
        console.error("Failed to remove recent project:", e);
    }
}

async function clearRecentProjects() {
    try {
        localStorage.removeItem("recent_projects");
        await clearRecentHandles();
    } catch (e) {
        console.error("Failed to clear recent projects:", e);
    }
}

// IndexedDB database functions for directory handles
async function saveRecentHandle(path, handle) {
    try {
        const db = await openDatabase();
        const tx = db.transaction("handles", "readwrite");
        const store = tx.objectStore("handles");
        await store.put(handle, path);
    } catch (e) {
        console.error("Failed to save recent folder handle:", e);
    }
}

async function loadRecentHandle(path) {
    try {
        const db = await openDatabase();
        const tx = db.transaction("handles", "readonly");
        const store = tx.objectStore("handles");
        return await new Promise((resolve) => {
            const req = store.get(path);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        });
    } catch (e) {
        console.error("Failed to load recent folder handle:", e);
        return null;
    }
}

async function deleteRecentHandle(path) {
    try {
        const db = await openDatabase();
        const tx = db.transaction("handles", "readwrite");
        const store = tx.objectStore("handles");
        await store.delete(path);
    } catch (e) {
        console.error("Failed to delete recent handle:", e);
    }
}

async function clearRecentHandles() {
    try {
        const db = await openDatabase();
        const tx = db.transaction("handles", "readwrite");
        const store = tx.objectStore("handles");
        const req = store.getAllKeys();
        req.onsuccess = async () => {
            const keys = req.result;
            for (const key of keys) {
                if (key !== "projectFolder") {
                    await store.delete(key);
                }
            }
        };
    } catch (e) {
        console.error("Failed to clear recent handles:", e);
    }
}

export {
    getRecentProjects,
    addRecentProject,
    removeRecentProject,
    clearRecentProjects,
    loadRecentHandle
};
