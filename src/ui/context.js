import { emptyMenu } from './emptyMenu.js'

let jsonData = JSON.parse(localStorage.getItem("jsonData")) ?? emptyMenu;

let groupedOs = {};
let itemlessOs = JSON.parse(localStorage.getItem("itemlessOs")) ?? {};

groupOptionSets()
console.log('groupedOs', groupedOs);

function setJsonData(data) {
    jsonData = data
    groupOptionSets()
    itemlessOs = {}
    updateItemlessLocalStorage();
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

function getOsObject(sectionId, itemId, osId) {
    const {sectionIndex, itemIndex} = getItemIndex(sectionId, itemId);
    const menuOs = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets;

    const osObject = menuOs.find(osElement => osElement.MenuItemOptionSetId == osId);

    return osObject
}

function getOptionIndex(sectionId, itemId, osId, optionId) {
    const {sectionIndex, itemIndex, osIndex} = getOsIndex(sectionId, itemId, osId)
    const menuOption = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems;

    const optionIndex = menuOption.findIndex(optionElement => optionElement.MenuItemOptionSetItemId == optionId)

    return {sectionIndex, itemIndex, osIndex, optionIndex}
}

function getOptionObject(sectionId, itemId, osId, optionId) {
    const menuOptions = getOsObject(sectionId, itemId, osId).MenuItemOptionSetItems;

    const optionIndex = menuOptions.findIndex(
        optionElement => optionElement.MenuItemOptionSetItemId == optionId
    )
    // const optionObject = menuOptions.find(option => option.MenuItemOptionSetItemId == optionId);

    return optionIndex
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

function getLocalStorageOptionSetIDs() {
    const existingoptionSetIDs = JSON.parse(localStorage.getItem("optionSetIDs") || "[]");
    return existingoptionSetIDs;
}

function getLocalStorageOptionSetItemsIDs() {
    const existingoptionSetItemsIDs = JSON.parse(localStorage.getItem("optionSetItemsIDs") || "[]");
    return existingoptionSetItemsIDs;
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
    updateLocalStorage()
}

//set itemID for entire json file
function setItemId(jsonData) {
    localStorage.setItem("itemIDs", "[]");
    var sectionId;
    for (const section of jsonData.MenuSections) {
        sectionId = section.MenuSectionId;
        for(const item of section.MenuItems) {
            let id = getRandomInt()
            item.MenuItemId = id;
            item.MenuSectionId = sectionId;
            updateItemCounterLocalStorage(id, true)
        }
    }
    updateLocalStorage()
}

function setOptionSetId(jsonData) {
    localStorage.setItem("optionSetIDs", "[]");
    var itemIDInOS
    for (const section of jsonData.MenuSections) {
        for (const item of section.MenuItems) {
            itemIDInOS = item.MenuItemId;
            for (const optionSet of item.MenuItemOptionSets) {
                optionSet.MenuItemId = itemIDInOS;
                optionSet.MenuItemOptionSetId = getRandomInt();
                updateOptionSetCounterLocalStorage(optionSet.MenuItemOptionSetId, true)
            }
        }
    }
    updateLocalStorage()
}

function setOptionSetItemsId(jsonData) {
    localStorage.setItem("optionSetItemsIDs", "[]");
    for (const section of jsonData.MenuSections) {
        for (const item of section.MenuItems) {
            for (const optionSet of item.MenuItemOptionSets) {
                for (const optionSetItem of optionSet.MenuItemOptionSetItems) {
                    optionSetItem.MenuItemOptionSetItemId = getRandomInt();
                    updateOptionSetItemsCounterLocalStorage(optionSetItem.MenuItemOptionSetItemId, true)
                }
            }
        }
    }
    updateLocalStorage()
}

function setSectionDisplayOrder(jsonData) {
    jsonData.MenuSections.forEach((obj, index) => {
        obj.DisplayOrder = index;
    });
}

//Updates JSON LocalStorage
function updateLocalStorage() {
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
}

function updateItemlessLocalStorage() {
    localStorage.setItem("itemlessOs", JSON.stringify(itemlessOs));
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

//Updates OS id in LocalStorage.
function updateOptionSetCounterLocalStorage(id, addID) {
    if(addID) {
        let existingIDs =  getLocalStorageOptionSetIDs();
        existingIDs.push(id);
        localStorage.setItem("optionSetIDs", JSON.stringify(existingIDs));
    } else {
        let existingIDs = getLocalStorageOptionSetIDs();
        const indexID = existingIDs.indexOf(Number(id));
        existingIDs.splice(indexID, 1);
        localStorage.setItem("optionSetIDs", JSON.stringify(existingIDs));
    }
}

//Updates OS items id in LocalStorage.
function updateOptionSetItemsCounterLocalStorage(id, addID) {
    if(addID) {
        let existingIDs =  getLocalStorageOptionSetItemsIDs();
        existingIDs.push(id);
        localStorage.setItem("optionSetItemsIDs", JSON.stringify(existingIDs));
    } else {
        let existingIDs = getLocalStorageOptionSetItemsIDs();
        const indexID = existingIDs.indexOf(Number(id));
        existingIDs.splice(indexID, 1);
        localStorage.setItem("optionSetItemsIDs", JSON.stringify(existingIDs));
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

function getSectionRow(menuSectionId){
    const sectionRowsArray = Array.from(document.getElementsByClassName('sectionRow'));
    const sectionRow = sectionRowsArray.find((p) => p.id == menuSectionId.toString())
    return sectionRow;
}
function getGroupOsKey(os) {
    const { Name, MinSelectCount, MaxSelectCount, MenuItemOptionSetItems } = os;
    const osLength = MenuItemOptionSetItems.length;
    const optionKey = MenuItemOptionSetItems.map(option => `${option.Name}_${option.Price}_${option.IsAvailable}`).join('|');
    return `${Name}_${MinSelectCount}_${MaxSelectCount}_${osLength}_${optionKey}`;
}

function groupOptionSets() {
    groupedOs = {};
    jsonData.MenuSections.forEach(sections => {
        sections.MenuItems.forEach(items => {
            items.MenuItemOptionSets.forEach(os => {
                const groupOsKey = getGroupOsKey(os)
                os.groupOsId = groupOsKey

                if (!groupedOs[groupOsKey]) {
                    groupedOs[groupOsKey] = [os];
                } else {
                    groupedOs[groupOsKey].push(os);
                }

                os.MenuItemOptionSetItems.forEach(option => {
                    const { Name, Price, IsAvailable } = option;
                    const groupOptionKey = `${Name}_${Price}_${IsAvailable}`;
                    option.groupOptionId = groupOptionKey
                })
            });
        })
    })
    updateLocalStorage()
}

function updateGroupedIdItemlessOs(menuOs) {
    const oldGroupOsId = menuOs.groupOsId

    addItemlessOs(itemlessOs[oldGroupOsId])
    deleteItemlessOs(oldGroupOsId)
}

function addItemlessOs(os) {
    const groupOsKey = getGroupOsKey(os)
    if (groupedOs[groupOsKey]) {
        return;
    }

    os.groupOsId = groupOsKey
    itemlessOs[groupOsKey] = os;
    updateItemlessLocalStorage();
}

function updateItemlessOsKey(oldKey) {
    const os = itemlessOs[oldKey];
    const newKey = getGroupOsKey(os);

    if (oldKey === newKey) {
        return;
    }

    if (!groupedOs[newKey]) {
        itemlessOs[newKey] = os;
    }

    os.groupOsId = newKey;
    delete itemlessOs[oldKey];
    updateItemlessLocalStorage();
}

function deleteItemlessOs(groupOsId) {
    delete itemlessOs[groupOsId];
    updateItemlessLocalStorage();
}

function setColorOfRows(optionRowsContainer) {
    const rows = Array.from(optionRowsContainer.querySelectorAll(".optionRow"));
    rows.forEach((row, index) => {
        if (index % 2 === 0) {
            row.classList.remove('even');
            row.classList.add('odd');
        } else {
            row.classList.remove('odd');
            row.classList.add('even');
        }
    });
}

function updateOsDomIds(menuOs, oldGroupOsId) {
    const osNameHeaderArray = Array.from(document.getElementsByClassName('osNameHeader'));
    const osNameHeader = osNameHeaderArray.filter((p) => p.id == oldGroupOsId)
    osNameHeader.forEach(os => {
        os.textContent = menuOs.Name;
        os.id = menuOs.groupOsId
    })

    const minSelectCountArray = Array.from(document.getElementsByClassName('minSelectCount'));
    const minSelectCount = minSelectCountArray.filter((p) => p.id == oldGroupOsId)
    minSelectCount.forEach(os => {
        os.textContent = menuOs.MinSelectCount
        os.id = menuOs.groupOsId
    })

    const maxSelectCountArray = Array.from(document.getElementsByClassName('maxSelectCount'));
    const maxSelectCount = maxSelectCountArray.filter((p) => p.id == oldGroupOsId)
    maxSelectCount.forEach(os => {
        os.textContent = menuOs.MaxSelectCount
        os.id = menuOs.groupOsId
    })

    const optionContainerArray = Array.from(document.getElementsByClassName('optionContainer'));
    const optionContainer = optionContainerArray.filter((p) => p.getAttribute("groupOsId") == oldGroupOsId)
    optionContainer.forEach(os => {
        os.setAttribute("groupOsId", menuOs.groupOsId)
    })
}

function updateOptionDomIds(menuOption, oldGroupOptionId) {
    const osRowOptionPreviewArray = Array.from(document.getElementsByClassName('osRowOption'));
    const osRowOptionPreview = osRowOptionPreviewArray.filter((p) => p.id == oldGroupOptionId)
    osRowOptionPreview.forEach(os => {
        os.id = menuOption.groupOptionId
        os.classList.toggle('unavailable', !menuOption.IsAvailable)
    })

    const optionRowwArray = Array.from(document.getElementsByClassName('optionRow'));
    const optionRoww = optionRowwArray.filter((p) => p.id == oldGroupOptionId)
    optionRoww.forEach(os => {
        os.id = menuOption.groupOptionId
    })

    const optionNamePreviewArray = Array.from(document.getElementsByClassName('optionNamePreview'));
    const optionNamePreview = optionNamePreviewArray.filter((p) => p.id == oldGroupOptionId)
    optionNamePreview.forEach(os => {
        os.textContent = menuOption.Name
        os.id = menuOption.groupOptionId
    })

    const optionPricePreviewArray = Array.from(document.getElementsByClassName('optionPricePreview'));
    const optionPricePreview = optionPricePreviewArray.filter((p) => p.id == oldGroupOptionId)
    optionPricePreview.forEach(os => {
        os.textContent = menuOption.Price
        os.id = menuOption.groupOptionId
    })
}

export {
    jsonData,
    groupedOs,
    itemlessOs,
    getSectionIndex,
    updateCounterLocalStorage,
    updateItemCounterLocalStorage,
    updateLocalStorage,
    setOptionSetId,
    updateOptionSetCounterLocalStorage,
    updateOptionSetItemsCounterLocalStorage,
    getLocalStorageItemIDs,
    getLocalStorageSectionIDs,
    getLocalStorageOptionSetIDs,
    getLocalStorageOptionSetItemsIDs,
    setJsonData,
    setSectionId,
    setOptionSetItemsId,
    getUniqueRandomInt,
    getRandomInt,
    setSectionDisplayOrder,
    getItemIndex,
    getDragAfterElement,
    setItemId,
    getOsIndex,
    getOptionIndex,
    getOptionObject,
    getOsObject,
    groupOptionSets,
    setColorOfRows,
    addItemlessOs,
    deleteItemlessOs,
    updateItemlessLocalStorage,
    updateGroupedIdItemlessOs,
    updateOsDomIds,
    updateOptionDomIds,
    updateItemlessOsKey,
    getSectionRow
}