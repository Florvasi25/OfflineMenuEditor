import {
    jsonData,
    getSectionIndex,
    updateLocalStorage,
    groupOptionSets,
    groupedOs,
    addItemlessOs,
    closeOsModalContainer
} from '../context.js';

import { slotManagerInstance } from '../mainContainer.js';

function sectionDeleteButton(rightSectionContainer, sectionRow) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('sectionButton')
    deleteButton.classList.add('deleteButton')
    rightSectionContainer.appendChild(deleteButton);
    const deleteButtonImg = document.createElement('img')
    deleteButtonImg.classList.add('sectionButtonImg')
    deleteButtonImg.src = '../../assets/deleteIcon.svg'
    deleteButton.appendChild(deleteButtonImg)
    deleteButton.addEventListener('click', () => {
        closeOsModalContainer()

        confirmDelete(sectionRow, rightSectionContainer)
    });
}

//Creates a popup to confirm the deletion of the section
function confirmDelete(sectionRow, rightSectionContainer) {
    const popup = document.createElement("div");
    popup.className = "popup";
    const sectionId = sectionRow.id;
    const sectionObject = jsonData.MenuSections.find(s => s.MenuSectionId == sectionId);

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `
        <p>Do you want to delete permanently "${sectionObject.Name}"</p>
        <button class="yesButton confirmDeleteBtn">Yes</button>
        <button class="noButton confirmDeleteBtn">No</button>
    `;

    popupContent.querySelector(".yesButton").addEventListener("click", function () {
        deleteSection(sectionRow);
        
        popup.remove();
    });

    popupContent.querySelector(".noButton").addEventListener("click", function () {
        popup.remove();
    });

    popup.appendChild(popupContent); 
    rightSectionContainer.appendChild(popup);

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

//Deletes Section from UI and LS
function deleteSection(sectionRow) {
    const sectionId = sectionRow.id;
    if (sectionRow) {
        const sectionIndex = getSectionIndex(sectionId);
        if (sectionIndex !== -1) {
            const section = jsonData.MenuSections[sectionIndex];
            if (sectionRow.classList.contains('expanded')) {
                let items = sectionRow.nextElementSibling;
                if (items.tagName === 'DIV' && items.classList.contains('itemTable')) {
                    items.remove();
                }
            }
            const deletedItems = section.MenuItems;

            const removedOptionSets = {};

            deletedItems.forEach((deletedItem) => {
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
            });

            jsonData.MenuSections.splice(sectionIndex, 1);
            jsonData.MenuSections.forEach((obj, index) => {
                obj.DisplayOrder = index;
            });

            Object.values(removedOptionSets).forEach((optionSet) => {
                addItemlessOs(optionSet);
            });

            groupOptionSets();
            updateLocalStorage(slotManagerInstance.currentSlot);
        }
        sectionRow.remove();
    }
}




export { sectionDeleteButton }
