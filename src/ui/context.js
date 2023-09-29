import { emptyMenu } from './emptyMenu.js'

let jsonData = JSON.parse(localStorage.getItem("jsonData")) ?? emptyMenu;

function setJsonData(data) {
    jsonData = data
}

//Gets Index
function getSectionIndex(sectionId) {
    const sectionIndex = jsonData.MenuSections.findIndex(sectionElement => sectionElement.MenuSectionId == sectionId)

    return sectionIndex
}

function getItemIndex(sectionId, itemId) {
    const sectionIndex = getSectionIndex(sectionId);
    const menuItems = jsonData.MenuSections[sectionIndex].MenuItems;

    const itemIndex = menuItems.findIndex(itemElement => itemElement.MenuItemId == itemId)

    return {sectionIndex, itemIndex}
}

function getOsIndex(sectionId, itemId, osId) {
    const {sectionIndex, itemIndex} = getItemIndex(sectionId, itemId);
    const menuOs = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets;

    const osIndex = menuOs.findIndex(osElement => osElement.MenuItemOptionSetId == osId)

    return {sectionIndex, itemIndex, osIndex}
}

function getOptionIndex(sectionId, itemId, osId, optionId) {
    const {sectionIndex, itemIndex, osIndex} = getOsIndex(sectionId, itemId, osId)
    const menuOption = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems;

    const optionIndex = menuOption.findIndex(optionElement => optionElement.MenuItemOptionSetItemId == optionId)

    return {sectionIndex, itemIndex, osIndex, optionIndex}
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

function getLocalStorageSectionIDs() {
    const existingSectionIDs = JSON.parse(localStorage.getItem("sectionIDs") || "[]");
    return existingSectionIDs;
}

function getLocalStorageItemIDs() {
    const existingItemIDs = JSON.parse(localStorage.getItem("itemIDs") || "[]");
    return existingItemIDs;
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

//set itemID for entire json file
function setItemId(jsonData) {
    localStorage.setItem("itemIDs", "[]");
    for (const section of jsonData.MenuSections) {
        for(const item of section.MenuItems) {
            let id = getRandomInt()
            item.MenuItemId = id;
            updateItemCounterLocalStorage(id, true)
        }
    }
    updateSectionLocalStorage()
}

function setSectionDisplayOrder(jsonData){
    jsonData.MenuSections.forEach((obj, index) => {
        obj.DisplayOrder = index;
    });
}

//Updates JSON LocalStorage
function updateSectionLocalStorage() {
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
}

//Updates sections id LocalStorage. 
//If 'addID' is true, will be added to localStorage. else, will be removed.
function updateCounterLocalStorage(id, addID) {
    if(addID) {
        let existingIDs =  getLocalStorageSectionIDs();//JSON.parse(localStorage.getItem("sectionIDs") || "[]"); //array
        existingIDs.push(id);
        localStorage.setItem("sectionIDs", JSON.stringify(existingIDs));
    } else {
        let existingIDs = getLocalStorageSectionIDs();//JSON.parse(localStorage.getItem("sectionIDs") || "[]"); 
        const indexID = existingIDs.indexOf(Number(id));
        existingIDs.splice(indexID, 1);
        localStorage.setItem("sectionIDs", JSON.stringify(existingIDs));
    }
}

//Updates items id LocalStorage.
function updateItemCounterLocalStorage(id, addID) {
    if(addID) {
        let existingIDs = getLocalStorageItemIDs(); //JSON.parse(localStorage.getItem("itemIDs") || "[]"); //array
        existingIDs.push(id);
        localStorage.setItem("itemIDs", JSON.stringify(existingIDs));
    } else {
        let existingIDs = getLocalStorageItemIDs(); //JSON.parse(localStorage.getItem("itemIDs") || "[]"); 
        const indexID = existingIDs.indexOf(Number(id));
        existingIDs.splice(indexID, 1);
        localStorage.setItem("itemIDs", JSON.stringify(existingIDs));
    }
}

function getRandomInt() {
    return Math.floor(Math.random() * 9999999) + 1;
}

function getUniqueRandomInt(localStorageIDs) {
    let randomNum = getRandomInt();

    while (localStorageIDs.includes(randomNum)) {
        randomNum = getRandomInt();
    }
    return randomNum;
}

export {
    jsonData,
    getSectionIndex,
    updateCounterLocalStorage,
    updateItemCounterLocalStorage,
    updateSectionLocalStorage,
    getLocalStorageItemIDs,
    getLocalStorageSectionIDs,
    setJsonData,
    setSectionId,
    getUniqueRandomInt,
    getRandomInt,
    setSectionDisplayOrder,
    getItemIndex,
    getDragAfterElement,
    setItemId,
    getOsIndex,
    getOptionIndex
}