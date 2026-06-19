async function writeFile(
fileHandle,
content
) {


const writable =
    await fileHandle.createWritable();

await writable.write(
    content
);

await writable.close();


}

export {
writeFile
};
