import { emptyMenu } from './emptyMenu.js'

import { removeToolTip, showToolTipMoM, showToolTip } from './toolTip.js'

let jsonData = JSON.parse(localStorage.getItem("jsonData")) ?? emptyMenu;

let groupedOs = {}; // Store the grouped os objects

let itemlessOs = JSON.parse(localStorage.getItem("itemlessOs")) ?? [];

let progressiveInt = parseInt(localStorage.getItem('lastProgressiveInt')) || 0;

groupOptionSets()

function setJsonData(data) {
    jsonData = data
    groupOptionSets()
    itemlessOs = []
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

    return { sectionIndex, itemIndex }
}

function getOsIndex(sectionId, itemId, osId) {
    const { sectionIndex, itemIndex } = getItemIndex(sectionId, itemId);
    const menuOs = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets;

    const osIndex = menuOs.findIndex(osElement => osElement.MenuItemOptionSetId == osId)

    return { sectionIndex, itemIndex, osIndex }
}

function getOsObject(sectionId, itemId, osId) {
    const { sectionIndex, itemIndex } = getItemIndex(sectionId, itemId);
    const menuOs = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets;

    const osObject = menuOs.find(osElement => osElement.MenuItemOptionSetId == osId);

    return osObject
}

function getOptionIndex(sectionId, itemId, osId, optionId) {
    const { sectionIndex, itemIndex, osIndex } = getOsIndex(sectionId, itemId, osId)
    const menuOption = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems;

    const optionIndex = menuOption.findIndex(optionElement => optionElement.MenuItemOptionSetItemId == optionId)

    return { sectionIndex, itemIndex, osIndex, optionIndex }
}

function getOptionObject(sectionId, itemId, osId, optionId) {
    const menuOptions = getOsObject(sectionId, itemId, osId).MenuItemOptionSetItems;

    const optionIndex = menuOptions.findIndex(
        optionElement => optionElement.MenuItemOptionSetItemId == optionId
    )

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
        for (const item of section.MenuItems) {
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
    var itemIDInOS;
    window.optionSetIdMap = {}; // Create a global map to store ID mapping

    for (const section of jsonData.MenuSections) {
        for (const item of section.MenuItems) {
            itemIDInOS = item.MenuItemId;
            for (const optionSet of item.MenuItemOptionSets) {
                const oldId = optionSet.MenuItemOptionSetId;
                const newId = getRandomInt();

                optionSet.MenuItemId = itemIDInOS;
                optionSet.MenuItemOptionSetId = newId;

                window.optionSetIdMap[oldId] = newId; // Map old ID to new ID

                updateOptionSetCounterLocalStorage(newId, true);
            }
        }
    }
    updateLocalStorage();
}


function setOptionSetItemsId(jsonData) {
    localStorage.setItem("optionSetItemsIDs", "[]");

    for (const section of jsonData.MenuSections) {
        for (const item of section.MenuItems) {
            for (const optionSet of item.MenuItemOptionSets) {
                for (const optionSetItem of optionSet.MenuItemOptionSetItems) {
                    optionSetItem.MenuItemOptionSetItemId = getRandomInt();

                    if (optionSetItem.NextMenuItemOptionSetId !== null) {
                        const newNextId = window.optionSetIdMap[optionSetItem.NextMenuItemOptionSetId];
                        if (newNextId) {
                            optionSetItem.NextMenuItemOptionSetId = newNextId;
                        }
                    }

                    updateOptionSetItemsCounterLocalStorage(optionSetItem.MenuItemOptionSetItemId, true);
                }
            }
        }
    }
    updateLocalStorage();
}


function setOptionSetIdForSection(sectionId) {
    var itemIDInOS;
    var optionSetIdMap = {}; // Local map to store ID mapping

    for (const section of jsonData.MenuSections) {
        if (section.MenuSectionId == sectionId) {
            for (const item of section.MenuItems) {
                itemIDInOS = item.MenuItemId;
                for (const optionSet of item.MenuItemOptionSets) {
                    const oldId = optionSet.MenuItemOptionSetId;
                    const newId = getRandomInt();

                    optionSet.MenuItemId = itemIDInOS;
                    optionSet.MenuItemOptionSetId = newId;

                    optionSetIdMap[oldId] = newId; // Map old ID to new ID in the local map

                    updateOptionSetCounterLocalStorage(newId, true);
                }
            }
        }
    }
    updateLocalStorage();
    return optionSetIdMap; // Return the map
}

function setOptionSetItemsIdForSection(sectionId, optionSetIdMap) {
    for (const section of jsonData.MenuSections) {
        if (section.MenuSectionId == sectionId) {
            for (const item of section.MenuItems) {
                for (const optionSet of item.MenuItemOptionSets) {
                    for (const optionSetItem of optionSet.MenuItemOptionSetItems) {
                        optionSetItem.MenuItemOptionSetItemId = getRandomInt();

                        if (optionSetItem.NextMenuItemOptionSetId !== null) {
                            const newNextId = optionSetIdMap[optionSetItem.NextMenuItemOptionSetId];
                            if (newNextId) {
                                optionSetItem.NextMenuItemOptionSetId = newNextId;
                            }
                        }

                        updateOptionSetItemsCounterLocalStorage(optionSetItem.MenuItemOptionSetItemId, true);
                    }
                }
            }
        }
    }
    updateLocalStorage();
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
    if (addID) {
        let existingIDs = getLocalStorageSectionIDs();//JSON.parse(localStorage.getItem("sectionIDs") || "[]"); //array
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
    if (addID) {
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
    if (addID) {
        let existingIDs = getLocalStorageOptionSetIDs();
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
    if (addID) {
        let existingIDs = getLocalStorageOptionSetItemsIDs();
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
    progressiveInt++;
    localStorage.setItem('lastProgressiveInt', progressiveInt);
    return progressiveInt;
}

function getUniqueRandomInt(localStorageIDs) {
    let randomNum = getRandomInt();

    while (localStorageIDs.includes(randomNum)) {
        randomNum = getRandomInt();
    }
    return randomNum;
}

function getSectionRow(menuSectionId) {
    const sectionRowsArray = Array.from(document.getElementsByClassName('sectionRow'));
    const sectionRow = sectionRowsArray.find((p) => p.id == menuSectionId.toString())
    return sectionRow;
}

function getMenuSection(jsonData, menuSectionId) {
    return jsonData.MenuSections.find(section => section.MenuSectionId.toString() === menuSectionId) || null;
}
function getGroupOsKey(os) {
    const { Name, MinSelectCount, MaxSelectCount, MenuItemOptionSetItems } = os;
    const osLength = MenuItemOptionSetItems.length;
    const optionKey = MenuItemOptionSetItems.map(option => `${option.Name}_${option.Price}_${option.IsAvailable}`).join('|');
    return `${Name}_${MinSelectCount}_${MaxSelectCount}_${osLength}_${optionKey}`;
}
function groupOptionSets() {
    groupedOs = {};
    const groupOsKeyToId = {}; // Dictionary to store groupOsKeys and their IDs

    jsonData.MenuSections.forEach(sections => {
        sections.MenuItems.forEach(items => {
            items.MenuItemOptionSets.forEach(os => {
                const groupOsKey = getGroupOsKey(os);
                if (!groupOsKeyToId[groupOsKey]) {
                    groupOsKeyToId[groupOsKey] = getRandomInt();
                }
                const numericId = groupOsKeyToId[groupOsKey];

                const groupOsKeyWithId = `group${numericId}`;
                os.groupOsId = groupOsKeyWithId;

                if (!groupedOs[groupOsKeyWithId]) {
                    groupedOs[groupOsKeyWithId] = [os];
                } else {
                    groupedOs[groupOsKeyWithId].push(os);
                }
            });
        });
    });
    updateLocalStorage();
}

function addItemlessOs(os) {
    itemlessOs.push(os);
    updateItemlessLocalStorage();
}

function deleteItemlessOs(os) {
    itemlessOs = itemlessOs.filter(o => o.MenuItemOptionSetId !== os.MenuItemOptionSetId);
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

function closeOsModalContainer() {
    const existingOsModal = document.querySelector('.osModalContainer')
    if (existingOsModal) {
        existingOsModal.classList.remove('show');
        existingOsModal.classList.add('hide');
        setTimeout(() => {
            existingOsModal.style.display = 'none';
            existingOsModal.classList.remove('hide');
            existingOsModal.remove()
        }, 300);
    }
}

function closeOsModalContainerQuick() {
    const existingOsModal = document.querySelector('.osModalContainer')
    if (existingOsModal) {
        existingOsModal.remove()
    }
}

function addWarningMoM() {
    const menuOsId = jsonData.MenuSections
        .flatMap(i => i.MenuItems)
        .flatMap(i => i.MenuItemOptionSets)
        .flatMap(i => i.MenuItemOptionSetId);
    console.log('menuOsId', menuOsId)

    const optionMoMPreviewArray = Array.from(document.getElementsByClassName('optionMoMPreview'));
    const optionMoMPreviewTextArray = optionMoMPreviewArray.map(i => Number(i.textContent)).filter(value => !isNaN(value));
    console.log('optionMoMPreviewTextArray', optionMoMPreviewTextArray);

    const removedOsArray = optionMoMPreviewTextArray.filter(value => !menuOsId.includes(value));
    console.log('removedOsArray', removedOsArray);

    if (removedOsArray) {
        removedOsArray.forEach(removedOs => {
            console.log('removedOs', removedOs);
            const optionMoMPreview = optionMoMPreviewArray.find((p) => Number(p.textContent) === removedOs);
            console.log('optionMoMPreview', optionMoMPreview);
            if (optionMoMPreview) {
                optionMoMPreview.style.color = '#ff0000';
                if (optionMoMPreview.classList.contains('notwarning')) {
                    optionMoMPreview.classList.remove('notwarning');
                    optionMoMPreview.classList.add('warning');
                }
            }
        });
    }

    const existingOsArray = optionMoMPreviewTextArray.filter(value => menuOsId.includes(value) || value === -1 || value === "null");
    console.log('existingOsArray', existingOsArray);
    
    if (existingOsArray.length > 0) {
        existingOsArray.forEach(existingOs => {
            const optionMoMPreview = optionMoMPreviewArray.find((p) => Number(p.textContent) === existingOs || p.textContent === "null");
            if (optionMoMPreview) {
                optionMoMPreview.classList.remove('warning');
                optionMoMPreview.classList.add('notwarning');
                optionMoMPreview.style.color = '#000000';
            }
        });
    }
    
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
    getSectionRow,
    getMenuSection,
    setOptionSetIdForSection,
    setOptionSetItemsIdForSection,
    closeOsModalContainer,
    closeOsModalContainerQuick,
    addWarningMoM
}