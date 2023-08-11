import { emptyMenu } from './emptyMenu.js'

let jsonData = JSON.parse(localStorage.getItem("jsonData")) ?? emptyMenu;
//let idCounter = 0;



function setJsonData(data) {
    jsonData = data
}

//Gets Section Index
function getSectionIndex(sectionId) {
    const sectionIndex = jsonData.MenuSections.findIndex(sectionElement => sectionElement.MenuSectionId == sectionId)

    return sectionIndex
}

//Updates JSON LocalStorage
function updateSectionLocalStorage() {
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
}

//Updates id LocalStorage
function updateCounterLocalStorage(id) {
    let existingIDs = JSON.parse(localStorage.getItem("sectionIDs"));
    existingIDs.push(id);
    localStorage.setItem("sectionIDs", JSON.stringify(existingIDs));
}

export {
    jsonData,
    getSectionIndex,
    updateCounterLocalStorage,
    updateSectionLocalStorage,
    setJsonData,
}