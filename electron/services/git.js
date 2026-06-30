const { exec } = require("child_process");

function executeGitCommand(
    command,
    cwd
) {

    return new Promise(

        (
            resolve,
            reject
        ) => {

            exec(

                command,

                {
                    cwd
                },

                (
                    error,
                    stdout,
                    stderr
                ) => {

                    if (
                        error
                    ) {

                        reject(
                            stderr ||
                            error.message
                        );

                        return;

                    }

                    resolve(
                        stdout.trim()
                    );

                }

            );

        }

    );

}

async function isGitRepository(
    projectPath
) {

    try {

        await executeGitCommand(

            "git rev-parse --is-inside-work-tree",

            projectPath

        );

        return true;

    }

    catch {

        return false;

    }

}

async function getCurrentBranch(
    projectPath
) {

    return await executeGitCommand(

        "git branch --show-current",

        projectPath

    );

}

async function getGitStatus(
    projectPath
) {

    return await executeGitCommand(

        "git status --porcelain",

        projectPath

    );

}

async function commit(
    projectPath,
    message
) {

    await executeGitCommand(

        "git add .",

        projectPath

    );

    return await executeGitCommand(

        `git commit -m "${message.replace(/"/g, '\\"')}"`,

        projectPath

    );

}

async function init(projectPath) {
    return await executeGitCommand("git init", projectPath);
}

async function clone(repoUrl, parentPath) {
    return await executeGitCommand(`git clone "${repoUrl}"`, parentPath);
}

async function commitSelected(projectPath, message, files) {
    await executeGitCommand("git reset", projectPath);
    for (const file of files) {
        await executeGitCommand(`git add "${file.replace(/"/g, '\\"')}"`, projectPath);
    }
    return await executeGitCommand(
        `git commit -m "${message.replace(/"/g, '\\"')}"`,
        projectPath
    );
}

module.exports = {

    isGitRepository,

    getCurrentBranch,

    getGitStatus,

    commit,

    init,

    clone,

    commitSelected

};