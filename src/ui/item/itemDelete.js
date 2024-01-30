import {
    jsonData,
    getItemIndex,
    getSectionRow,
    updateLocalStorage,
    groupOptionSets,
    groupedOs,
    addItemlessOs,
    closeOsModalContainer
} from '../context.js';

import { changeSectionClockIconColor, changeSectionClockIcon } from '../clock/sectionClock.js';


function itemDeleteButton(itemButtonsCell, itemRow, sectionId) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('sectionButton')
    deleteButton.classList.add('deleteButton')
    itemButtonsCell.appendChild(deleteButton);
    const deleteButtonImg = document.createElement('img')
    deleteButtonImg.classList.add('sectionButtonImg')
    deleteButtonImg.src = '../../assets/deleteIcon.svg'
    deleteButton.appendChild(deleteButtonImg)
    deleteButton.addEventListener('click', () => {
        confirmDelete(itemRow, itemButtonsCell, sectionId)
    });
}

//Creates a popup to confirm the deletion of the item
function confirmDelete(itemRow, itemButtonsCell, sectionId) {
    const popup = document.createElement("div");
    popup.className = "popup";
    const itemId = itemRow.id;
    const sectionObject = jsonData.MenuSections.find(s => s.MenuSectionId == sectionId);
    const itemObject = sectionObject.MenuItems.find(s => s.MenuItemId == itemId);

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `
        <p>Do you want to delete permanently "${itemObject.Name}"</p>
        <button class="yesButton confirmDeleteBtn">Yes</button>
        <button class="noButton confirmDeleteBtn">No</button>
    `;

    popupContent.querySelector(".yesButton").addEventListener("click", function () {
        deleteItem(itemRow, sectionId);

        closeOsModalContainer()

        popup.remove();
    });

    popupContent.querySelector(".noButton").addEventListener("click", function () {
        popup.remove();
    });

    popup.appendChild(popupContent); 
    itemButtonsCell.appendChild(popup);

    //Close the delete popup when clicked outside
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("popup")) {
            e.target.remove();
        }
    });

    //Close the delete popup when pressed "Esc"
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const popup = document.querySelector(".popup");
            if (popup !== null) {
                popup.remove();
            }
        }
    });
}

//Deletes item from UI and LS
function deleteItem(itemRow, sectionId) {
    const itemId = itemRow.id;
    if (itemRow) {
        if (itemRow.classList.contains('expanded')) {
            let item = itemRow.nextElementSibling;
            if (item.tagName === 'DIV' && item.classList.contains('osTable')) {
                item.remove();
            }
        }
        itemRow.remove();
        const { itemIndex, sectionIndex } = getItemIndex(sectionId, itemId);
        const sectionRow = getSectionRow(sectionId);
        if (itemIndex !== -1) {
            const deletedItem = jsonData.MenuSections[sectionIndex].MenuItems.splice(itemIndex, 1)[0];
            jsonData.MenuSections[sectionIndex].MenuItems.forEach((obj, index) => {
                obj.DisplayOrder = index;
            });

            const removedOptionSets = {};

            if (deletedItem.MenuItemOptionSets && deletedItem.MenuItemOptionSets.length > 0) {
                deletedItem.MenuItemOptionSets.forEach((optionSet) => {
                    if (groupedOs[optionSet.groupOsId]) {
                        if (groupedOs[optionSet.groupOsId].length === 1) {
                            delete groupedOs[optionSet.groupOsId];
                            removedOptionSets[optionSet.groupOsId] = optionSet;
                        } else {
                            groupedOs[optionSet.groupOsId] = groupedOs[optionSet.groupOsId].filter(
                                (os) => os !== optionSet
                            );
                        }
                    }
                });
            }

            Object.values(removedOptionSets).forEach((optionSet) => {
                addItemlessOs(optionSet);
            });

            if(jsonData.MenuSections[sectionIndex].MenuItems.length == 0){ 
                changeSectionClockIconColor(sectionRow, '')
            } else if (jsonData.MenuSections[sectionIndex].MenuItems.length == 1 && 
                            jsonData.MenuSections[sectionIndex].MenuItems[0].DailySpecialHours.length > 0){
                changeSectionClockIconColor(sectionRow, '#80d66f')                    
            }else{ changeSectionClockIcon(sectionRow, sectionId) }

            groupOptionSets();
            updateLocalStorage();
        }
    }
}



export { itemDeleteButton }
