import {
    jsonData,
    getOptionIndex,
    updateItemCounterLocalStorage,
    updateSectionLocalStorage,
} from '../../context.js';

function optionDeleteButton(optionButtonsCell, optionRow, sectionId, itemId, osId) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('sectionButton')
    deleteButton.classList.add('deleteButton')
    optionButtonsCell.appendChild(deleteButton);
    const deleteButtonImg = document.createElement('img')
    deleteButtonImg.classList.add('sectionButtonImg')
    deleteButtonImg.src = '../../assets/deleteIcon.svg'
    deleteButton.appendChild(deleteButtonImg)
    deleteButton.addEventListener('click', () => {
        confirmDelete(optionRow, optionButtonsCell, sectionId, itemId, osId)
    });
}

//Creates a popup to confirm the deletion of the item
function confirmDelete(optionRow, optionButtonsCell, sectionId, itemId, osId) {
    const popup = document.createElement("div");
    popup.className = "popup";
    const optionId = optionRow.id;
    const sectionObject = jsonData.MenuSections.find(section => section.MenuSectionId == sectionId);
    const itemObject = sectionObject.MenuItems.find(item => item.MenuItemId == itemId);
    const osObject = itemObject.MenuItemOptionSets.find(os => os.MenuItemOptionSetId == osId);
    const optionObject = osObject.MenuItemOptionSetItems.find(option => option.MenuItemOptionSetItemId == optionId);

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `
        <p>Do you want to delete permanently "${optionObject.Name}"</p>
        <button class="yesButton confirmDeleteBtn">Yes</button>
        <button class="noButton confirmDeleteBtn">No</button>
    `;

    popupContent.querySelector(".yesButton").addEventListener("click", function () {
        deleteItem(optionRow, sectionId, itemId, osId);
        popup.remove();
    });

    popupContent.querySelector(".noButton").addEventListener("click", function () {
        popup.remove();
    });

    popup.appendChild(popupContent); 
    optionButtonsCell.appendChild(popup);

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
function deleteItem(optionRow, sectionId, itemId, osId) {
    const optionId = optionRow.id;
    if (optionRow) {
        // if (optionRow.classList.contains('expanded')) {
        //     let optionSet = optionRow.nextElementSibling;
        //     if (optionSet && optionSet.tagName === 'DIV' && optionSet.classList.contains('osContainer')) {
        //         optionSet.remove();
        //     }
        // }
        optionRow.remove(); 
        const {sectionIndex, itemIndex, osIndex, optionIndex} = getOptionIndex(sectionId, itemId, osId, optionId);
        if (optionIndex !== -1) {
            jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems.splice(itemIndex, 1);
            jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems.forEach((obj, index) => {
                obj.DisplayOrder = index;
            });
            updateSectionLocalStorage();
            updateItemCounterLocalStorage(optionId, false);
        }
    }
}

export {
    optionDeleteButton,
}
