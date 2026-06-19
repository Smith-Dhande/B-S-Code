async function readFile(
fileHandle
) {

const file =
    await fileHandle.getFile();

const content =
    await file.text();

return content;

}

export {
readFile
};
