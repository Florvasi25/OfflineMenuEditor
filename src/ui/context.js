import { emptyMenu } from './emptyMenu.js'


import { slotManagerInstance } from './mainContainer.js';

let jsonData = JSON.parse(localStorage.getItem("jsonDataSlot1")) ?? emptyMenu;

let groupedOs = {}; // Store the grouped os objects

let itemlessOs = JSON.parse(localStorage.getItem("itemlessOsSlot1")) ?? [];

let progressiveInt = parseInt(localStorage.getItem('lastProgressiveInt')) || 0;

groupOptionSets()

setTimeout(() => {
    updateLocalStorage(slotManagerInstance.currentSlot);
    }, 1000);

function setJsonData(data) {
    jsonData = data;
    groupOptionSets();
    itemlessOs = [];
    updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
}

function updateJsonData(newJsonData){
    jsonData = newJsonData;
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

//set sectionID for entire json file
function setSectionId(jsonData) {
    for (const section of jsonData.MenuSections) {
        let id = getRandomInt()
        section.MenuSectionId = id;
        section.MenuSectionAvailability.MenuSectionId = id;
    }
    updateLocalStorage(slotManagerInstance.currentSlot)
}

//set itemID for entire json file
function setItemId(jsonData) {
    var sectionId;
    for (const section of jsonData.MenuSections) {
        sectionId = section.MenuSectionId;
        for (const item of section.MenuItems) {
            let id = getRandomInt()
            item.MenuItemId = id;
            item.MenuSectionId = sectionId;
        }
    }
    updateLocalStorage(slotManagerInstance.currentSlot)
}

function setOptionSetId(jsonData) {
    var itemIDInOS;
    window.optionSetIdMap = {}; // Create a global map to store ID mapping

    for (const section of jsonData.MenuSections) {
        for (const item of section.MenuItems) {
            itemIDInOS = item.MenuItemId;
            let foundMasterOptionSet = false; // Flag to track if a master option set is found
            let displayOrderCounter = 0; // Counter for setting display order
            
            for (const optionSet of item.MenuItemOptionSets) {
                const oldId = optionSet.MenuItemOptionSetId;
                const newId = getRandomInt();

                optionSet.MenuItemId = itemIDInOS;
                optionSet.MenuItemOptionSetId = newId;

                window.optionSetIdMap[oldId] = newId; // Map old ID to new ID

                if (optionSet.IsMasterOptionSet) {
                    if (foundMasterOptionSet) {
                        optionSet.DisplayOrder = displayOrderCounter++;
                    } else {
                        optionSet.DisplayOrder = -1;
                        foundMasterOptionSet = true;
                    }
                } else {
                    optionSet.DisplayOrder = displayOrderCounter++;
                }
            }
        }
    }
    updateLocalStorage(slotManagerInstance.currentSlot);
}


function setOptionSetItemsId(jsonData) {
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
                }
            }
        }
    }
    updateLocalStorage(slotManagerInstance.currentSlot);
}


function setOptionSetIdItem(menuItem) {
    let optionSetIdMap = {}; // Local map to store ID mapping
    for (const optionSet of menuItem.MenuItemOptionSets) {
        const oldId = optionSet.MenuItemOptionSetId;
        const newId = getRandomInt();
        optionSet.MenuItemId = menuItem.MenuItemId;
        optionSet.MenuItemOptionSetId = newId;
    
        optionSetIdMap[oldId] = newId; // Map old ID to new ID in the local map
    }

    updateLocalStorage(slotManagerInstance.currentSlot);
    return optionSetIdMap; // Return the map
}

function setOptionSetItemsIdForItem(menuItem, optionSetIdMap) {
    for (const optionSet of menuItem.MenuItemOptionSets) {
        for (const optionSetItem of optionSet.MenuItemOptionSetItems) {
            optionSetItem.MenuItemOptionSetItemId = getRandomInt();
            if (optionSetItem.NextMenuItemOptionSetId !== null) {
                const newNextId = optionSetIdMap[optionSetItem.NextMenuItemOptionSetId];
                if (newNextId) {
                    optionSetItem.NextMenuItemOptionSetId = newNextId;
                }
            }
        }
    }

    updateLocalStorage(slotManagerInstance.currentSlot);
}

function removePublicId(MenuItemOptionSets){
    MenuItemOptionSets.forEach(( optionSet ) => {
        if(optionSet.PublicId){ delete optionSet.PublicId;}
        removePublicIdFromOSItem(optionSet);
    });
}

function removePublicIdFromOSItem(optionSet){
    optionSet.MenuItemOptionSetItems.forEach((optionSetItem) => {
        if(optionSetItem.PublicId){ delete optionSetItem.PublicId;}
    });
}
function setSectionDisplayOrder(jsonData) {
    jsonData.MenuSections.forEach((obj, index) => {
        obj.DisplayOrder = index;
    });
}

//Updates JSON LocalStorage
function updateLocalStorage(currentSlot) {
    localStorage.setItem(currentSlot, JSON.stringify(jsonData));
}

function updateItemlessLocalStorage(currentItemlessOs) {
    localStorage.setItem(currentItemlessOs, JSON.stringify(itemlessOs));
}

function getRandomInt() {
    progressiveInt++;
    localStorage.setItem('lastProgressiveInt', progressiveInt);
    return progressiveInt;
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

// Add a function to generate random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function groupOptionSets() {
    groupedOs = {};
    const groupOsKeyToId = {}; // Dictionary to store groupOsKeys and their IDs
    const groupColors = {}; // Dictionary to store groupOsIds and their corresponding colors

    jsonData.MenuSections.forEach(sections => {
        sections.MenuItems.forEach(items => {
            items.MenuItemOptionSets.forEach(os => {
                const groupOsKey = getGroupOsKey(os);
                if (!groupOsKeyToId[groupOsKey]) {
                    const groupId = getRandomInt();
                    groupOsKeyToId[groupOsKey] = groupId;
                    // Check if groupColor already exists for the group
                    if (os.groupColor) {
                        groupColors[groupId] = os.groupColor; // Use the existing color
                    } else {
                        groupColors[groupId] = getRandomColor(); // Assign random color to the group
                    }
                }
                const groupOsId = groupOsKeyToId[groupOsKey];

                const groupOsKeyWithId = `group${groupOsId}`;
                os.groupOsId = groupOsKeyWithId;
                os.groupColor = groupColors[groupOsId]; // Assign color to the option set

                if (!groupedOs[groupOsKeyWithId]) {
                    groupedOs[groupOsKeyWithId] = [os];
                } else {
                    groupedOs[groupOsKeyWithId].push(os);
                }
            });
        });
    });
    setTimeout(() => {
        updateLocalStorage(slotManagerInstance.currentSlot);
    }, 1000);
}

function addItemlessOs(os) {
    // Assign a groupColor to the itemless OS if it doesn't have one
    if (!os.groupColor) {
        os.groupColor = getRandomColor(); // Generate a random color
    }
    itemlessOs.push(os);
    updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
}


function deleteItemlessOs(os) {
    itemlessOs = itemlessOs.filter(o => o.MenuItemOptionSetId !== os.MenuItemOptionSetId);
    updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
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

function checkForNullOsNames(){
    for (const section of jsonData.MenuSections) {
        for (const item of section.MenuItems) {
            for (const optionSet of item.MenuItemOptionSets) {
                if (optionSet.Name == null || optionSet.Name == '') {
                    optionSet.Name = 'Empty';
                }
                for (const optionSetItem of optionSet.MenuItemOptionSetItems) {
                    if (optionSetItem.Name == null || optionSetItem.Name == '') {
                        optionSetItem.Name = 'Empty';
                    }
                }
            }   
        }
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

    const optionMoMPreviewArray = Array.from(document.getElementsByClassName('optionMoMPreview'));

    const optionMoMPreviewTextArray = optionMoMPreviewArray.map(i => Number(i.textContent)).filter(value => !isNaN(value));

    const removedOsArray = optionMoMPreviewTextArray.filter(value => !menuOsId.includes(value));

    if (removedOsArray.length > 0) {
        removedOsArray.forEach(removedOs => {
            const optionMoMPreviews = optionMoMPreviewArray.filter((p) => Number(p.textContent) === removedOs);
            optionMoMPreviews.forEach(optionMoMPreview => {
                optionMoMPreview.style.color = '#ff0000';
                if (optionMoMPreview.classList.contains('notwarning')) {
                    optionMoMPreview.classList.remove('notwarning');
                    optionMoMPreview.classList.add('warning');
                }
            });
        });
    }

    const existingOsArray = optionMoMPreviewTextArray.filter(value => menuOsId.includes(value) || value === -1 || value === "null");

    if (existingOsArray.length > 0) {
        existingOsArray.forEach(existingOs => {
            const optionMoMPreviews = optionMoMPreviewArray.filter((p) => Number(p.textContent) === existingOs);
            optionMoMPreviews.forEach(optionMoMPreview => {
                optionMoMPreview.classList.remove('warning');
                optionMoMPreview.classList.add('notwarning');
                optionMoMPreview.style.color = '#000000';
            });
        });
    }
}

export {
    jsonData,
    groupedOs,
    itemlessOs,
    getSectionIndex,
    updateLocalStorage,
    setOptionSetId,
    setJsonData,
    setSectionId,
    setOptionSetItemsId,
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
    setOptionSetIdItem,
    setOptionSetItemsIdForItem,
    closeOsModalContainer,
    closeOsModalContainerQuick,
    addWarningMoM,
    removePublicId,
    removePublicIdFromOSItem,
    updateJsonData,
    checkForNullOsNames,
    getRandomColor
}