import { emptyMenu } from './emptyMenu.js'

let jsonData = JSON.parse(localStorage.getItem("jsonData")) ?? emptyMenu;

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
function updateCounterLocalStorage(id, addID) {
    if(addID)
    {
        let existingIDs = JSON.parse(localStorage.getItem("sectionIDs") || "[]"); //array
        existingIDs.push(id);
        localStorage.setItem("sectionIDs", JSON.stringify(existingIDs));
    }else{
        let existingIDs = JSON.parse(localStorage.getItem("sectionIDs") || "[]"); //array
        const indexID = existingIDs.indexOf(Number(id));
        existingIDs.splice(indexID, 1);
        localStorage.setItem("sectionIDs", JSON.stringify(existingIDs));
    }
    
}

function getRandomInt() {
    return Math.floor(Math.random() * 9999999) + 1;
}

function getUniqueRandomInt() {
    const storedNumbers = JSON.parse(localStorage.getItem("sectionIDs") || "[]");
    let randomNum = getRandomInt();

    while (storedNumbers.includes(randomNum)) {
        randomNum = getRandomInt();
    }
    return randomNum;
}

//set sectionID for entire json file
function setSectionId(jsonData) {
    localStorage.setItem("sectionIDs", "[]");
    for (const section of jsonData.MenuSections) {
        let id = getRandomInt()
        section.MenuSectionId = id;
        section.MenuSectionAvailability.MenuSectionId = id;
        updateCounterLocalStorage(id, true)
    }
    updateSectionLocalStorage()
}

function setSectionDisplayOrder(jsonData){
    jsonData.MenuSections.forEach((obj, index) => {
        obj.DisplayOrder = index;
    });
}

export {
    jsonData,
    getSectionIndex,
    updateCounterLocalStorage,
    updateSectionLocalStorage,
    setJsonData,
    setSectionId,
    getUniqueRandomInt,
    setSectionDisplayOrder
}