const { app, safeStorage } = require("electron");
const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");

function getTokenFilePath() {
    return path.join(app.getPath('userData'), 'github_token.enc');
}

async function getStoredToken() {
    try {
        const filePath = getTokenFilePath();
        const data = await fs.readFile(filePath);
        if (safeStorage.isEncryptionAvailable()) {
            return safeStorage.decryptString(data);
        } else {
            return data.toString('utf8');
        }
    } catch (e) {
        return null;
    }
}

async function storeToken(token) {
    const filePath = getTokenFilePath();
    let data;
    if (safeStorage.isEncryptionAvailable()) {
        data = safeStorage.encryptString(token);
    } else {
        data = Buffer.from(token, 'utf8');
    }
    await fs.writeFile(filePath, data);
}

async function deleteStoredToken() {
    try {
        const filePath = getTokenFilePath();
        await fs.unlink(filePath);
    } catch (e) {
        // ignore
    }
}

async function checkToken(token) {
    if (!token) return null;
    try {
        const response = await fetch("https://api.github.com/user", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "User-Agent": "BS-Code",
                "Accept": "application/vnd.github.v3+json"
            }
        });
        if (response.ok) {
            const data = await response.json();
            return {
                login: data.login,
                name: data.name
            };
        }
    } catch (error) {
        console.error("Error checking GitHub token:", error);
    }
    return null;
}

async function checkGitHubAuth() {
    const token = await getStoredToken();
    if (!token) return null;
    return await checkToken(token);
}

async function requestDeviceCode() {
    const response = await fetch("https://github.com/login/device/code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            client_id: "178c6fc778ccc68e1d6a",
            scope: "repo,read:user"
        })
    });
    if (!response.ok) {
        throw new Error(`Failed to request device code: ${response.statusText}`);
    }
    return await response.json();
}

async function pollForToken(deviceCode, intervalSeconds) {
    const clientId = "178c6fc778ccc68e1d6a";
    const maxTime = Date.now() + 15 * 60 * 1000; // 15 mins
    let intervalMs = intervalSeconds * 1000;

    while (Date.now() < maxTime) {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        
        try {
            const response = await fetch("https://github.com/login/oauth/access_token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    client_id: clientId,
                    device_code: deviceCode,
                    grant_type: "urn:ietf:params:oauth:grant-type:device_code"
                })
            });
            
            if (!response.ok) {
                throw new Error(`Polling error: ${response.statusText}`);
            }
            
            const data = await response.json();
            if (data.access_token) {
                await storeToken(data.access_token);
                const user = await checkToken(data.access_token);
                return { success: true, user };
            }
            
            if (data.error) {
                if (data.error === "authorization_pending") {
                    continue;
                } else if (data.error === "slow_down") {
                    intervalMs += 5000;
                    continue;
                } else {
                    return { success: false, error: data.error_description || data.error };
                }
            }
        } catch (e) {
            console.error("Error during polling:", e);
        }
    }
    return { success: false, error: "Authentication timed out" };
}

async function createRepo(repoName, isPrivate) {
    const token = await getStoredToken();
    if (!token) throw new Error("Not authenticated with GitHub");

    const response = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "BS-Code"
        },
        body: JSON.stringify({
            name: repoName,
            private: isPrivate,
            auto_init: false
        })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to create repository: ${response.statusText}`);
    }

    return await response.json();
}

async function publishProject(projectPath, repoName, isPrivate, cloneUrl) {
    const token = await getStoredToken();
    if (!token) throw new Error("Not authenticated");

    const user = await checkToken(token);
    if (!user) throw new Error("Token is invalid");

    // Construct authenticated URL
    const authenticatedUrl = `https://${token}@github.com/${user.login}/${repoName}.git`;

    const runCmd = (cmd) => {
        return new Promise((resolve, reject) => {
            exec(cmd, { cwd: projectPath }, (error, stdout, stderr) => {
                if (error) {
                    reject(stderr || error.message);
                } else {
                    resolve(stdout.trim());
                }
            });
        });
    };

    // 1. Git init if not already initialized
    let isRepo = false;
    try {
        await runCmd("git rev-parse --is-inside-work-tree");
        isRepo = true;
    } catch (e) {
        isRepo = false;
    }

    if (!isRepo) {
        await runCmd("git init");
    }

    // 2. Stage all files
    await runCmd("git add .");

    // 3. Check if there are commits. If not, make initial commit.
    let hasCommits = false;
    try {
        await runCmd("git rev-parse HEAD");
        hasCommits = true;
    } catch (e) {
        hasCommits = false;
    }

    if (!hasCommits) {
        await runCmd('git commit -m "Initial commit"');
    }

    // 4. Rename/ensure branch is main
    await runCmd("git branch -M main");

    // 5. Add remote origin
    try {
        await runCmd("git remote remove origin");
    } catch (e) {
        // ignore
    }
    await runCmd(`git remote add origin ${authenticatedUrl}`);

    // 6. Push to origin main
    await runCmd("git push -u origin main");

    return true;
}

module.exports = {
    checkGitHubAuth,
    requestDeviceCode,
    pollForToken,
    createRepo,
    publishProject,
    deleteStoredToken
};
