async function runEnvironmentChecks() {
    const checks = {
        git: { status: false, label: "Git Installed", actionLabel: "Download Git", type: "url", target: "https://git-scm.com/downloads" },
        internet: { status: false, label: "Internet Connection", actionLabel: "Check Connection", type: "action", target: "internet" },
        github: { status: false, label: "GitHub Connection", actionLabel: "Sign In", type: "action", target: "github" },
        ai: { status: false, label: "AI Provider (Ollama)", actionLabel: "Configure AI", type: "url", target: "https://ollama.com" }
    };

    // 1. Git Check
    try {
        checks.git.status = await window.git.checkGitInstalled();
    } catch (e) {
        checks.git.status = false;
    }

    // 2. Internet Check
    checks.internet.status = navigator.onLine;

    // 3. GitHub Check
    try {
        const user = await window.github.checkAuth();
        checks.github.status = !!user;
    } catch (e) {
        checks.github.status = false;
    }

    // 4. AI Provider Check
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const response = await fetch("http://localhost:11434/api/tags", { signal: controller.signal });
        clearTimeout(timeoutId);
        checks.ai.status = response.ok;
    } catch (e) {
        checks.ai.status = false;
    }

    return checks;
}

export { runEnvironmentChecks };
