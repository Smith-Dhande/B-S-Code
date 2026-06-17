
async function selectFolder(){
    let selectedOpenFolder = await window.showDirectoryPicker();
    return selectedOpenFolder;
};

export {selectFolder};