import { clearRecentProjects } from "./recentProjects.js";
import { showWelcomeScreen } from "./welcome.js";

function isFirstRun() {
    const run = localStorage.getItem("first_run_completed");
    if (!run) {
        localStorage.setItem("first_run_completed", "true");
        return true;
    }
    return false;
}

function initializeSettings() {
    const settingsBtn = document.getElementById("settings-btn");
    const settingsDropdown = document.getElementById("settings-dropdown");
    if (!settingsBtn || !settingsDropdown) return;

    // Toggle dropdown visibility on gear click
    settingsBtn.onclick = (e) => {
        e.stopPropagation();
        settingsDropdown.hidden = !settingsDropdown.hidden;
    };

    // Close dropdown on click outside
    document.addEventListener("click", () => {
        settingsDropdown.hidden = true;
    });

    settingsDropdown.onclick = (e) => {
        e.stopPropagation();
    };

    // Toggle: Show Welcome Screen on Startup
    const showWelcomeOnStartupItem = document.getElementById("set-show-welcome");
    const showWelcomeCheckbox = showWelcomeOnStartupItem.querySelector("i");
    
    const updateWelcomeCheckboxUI = () => {
        const show = localStorage.getItem("show_welcome_on_startup") !== "false";
        if (show) {
            showWelcomeCheckbox.className = "fa-solid fa-square-check";
            showWelcomeCheckbox.style.color = "var(--accent-color)";
        } else {
            showWelcomeCheckbox.className = "fa-solid fa-square";
            showWelcomeCheckbox.style.color = "var(--text-muted)";
        }
    };
    
    updateWelcomeCheckboxUI();

    showWelcomeOnStartupItem.onclick = () => {
        const current = localStorage.getItem("show_welcome_on_startup") !== "false";
        localStorage.setItem("show_welcome_on_startup", (!current).toString());
        updateWelcomeCheckboxUI();
    };

    // Option: Show Welcome Screen Now
    const showWelcomeNowItem = document.getElementById("set-open-welcome");
    showWelcomeNowItem.onclick = () => {
        settingsDropdown.hidden = true;
        showWelcomeScreen();
    };

    // Option: Clear Recent Projects
    const clearRecentItem = document.getElementById("set-clear-recent");
    clearRecentItem.onclick = async () => {
        if (confirm("Are you sure you want to clear all recent projects?")) {
            settingsDropdown.hidden = true;
            await clearRecentProjects();
            // Refresh welcome screen list if it's currently showing
            const welcomeScreen = document.getElementById("welcome-screen");
            if (welcomeScreen && !welcomeScreen.hidden) {
                showWelcomeScreen();
            }
            alert("Recent projects cleared.");
        }
    };
}

export { isFirstRun, initializeSettings };
