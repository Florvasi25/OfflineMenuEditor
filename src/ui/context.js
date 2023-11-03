import { emptyMenu } from './emptyMenu.js'

let jsonData = JSON.parse(localStorage.getItem("jsonData")) ?? emptyMenu;

let groupedOs = JSON.parse(localStorage.getItem("groupedOs")) ?? {};

console.log('groupedOs', groupedOs);

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

function groupInitOptionSets() {
    groupedOs = {};
    jsonData.MenuSections.forEach(sections => {
        sections.MenuItems.forEach(items => {
            items.MenuItemOptionSets.forEach(os => {
                const { Name, MinSelectCount, MaxSelectCount, MenuItemOptionSetItems } = os;
                const osLength = MenuItemOptionSetItems.length;
                const optionKey = MenuItemOptionSetItems.map(option => `${option.Name}_${option.Price}_${option.IsAvailable}`).join('|');
                const groupOsKey = `${Name}_${MinSelectCount}_${MaxSelectCount}_${osLength}_${optionKey}`;
                os.groupOsId = groupOsKey
                
                const osClone = { ...os }

                if (!groupedOs[groupOsKey]) {
                    groupedOs[groupOsKey] = [osClone];
                } else {
                    groupedOs[groupOsKey].push(osClone);
                }

                os.MenuItemOptionSetItems.forEach(option => {
                    const { Name, Price, IsAvailable } = option;
                    const groupOptionKey = `${Name}_${Price}_${IsAvailable}`;
                    option.groupOptionId = groupOptionKey
                })
            });
        })
    })

    localStorage.setItem("groupedOs", JSON.stringify(groupedOs));
}

// function regroupOs() {
//     groupedOs = {};
//     for (const key in allOs) {
//         allOs[key].forEach(os => {
//             const { Name, MinSelectCount, MaxSelectCount, MenuItemOptionSetItems } = os;
//             const osLength = MenuItemOptionSetItems.length;
//             const optionKey = MenuItemOptionSetItems.map(option => `${option.Name}_${option.Price}_${option.IsAvailable}`).join('|');
//             const groupOsKey = `${Name}_${MinSelectCount}_${MaxSelectCount}_${osLength}_${optionKey}`;
//             os.groupOsId = groupOsKey

//             if (!groupedOs[groupOsKey]) {
//                 groupedOs[groupOsKey] = [os];
//             } else {
//                 groupedOs[groupOsKey].push(os);
//             }

//             os.MenuItemOptionSetItems.forEach(option => {
//                 const { Name, Price, IsAvailable } = option;
//                 const groupOptionKey = `${Name}_${Price}_${IsAvailable}`;
//                 option.groupOptionId = groupOptionKey
//             })        
//         });
//     }

//     localStorage.setItem("groupedOs", JSON.stringify(groupedOs));
// }

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

export {
    jsonData,
    groupedOs,
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
    groupInitOptionSets,
    setColorOfRows,
}