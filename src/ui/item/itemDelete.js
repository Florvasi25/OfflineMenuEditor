import {
    jsonData,
    getItemIndex,
    updateItemCounterLocalStorage,
    updateSectionLocalStorage,
} from '../context.js';

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


//Creates a popup to confirm the deletion of the section
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
            let Os = itemRow.nextElementSibling;
            if (Os && Os.tagName === 'TABLE') {
                Os.remove();
            }
        }
        itemRow.remove(); 
        const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
        if (itemIndex !== -1) {
            jsonData.MenuSections[sectionIndex].MenuItems.splice(itemIndex, 1);
            jsonData.MenuSections[sectionIndex].MenuItems.forEach((obj, index) => {
                obj.DisplayOrder = index;
            });
            updateSectionLocalStorage();
            updateItemCounterLocalStorage(itemId, false);
        }
    }
}

export {
    itemDeleteButton,
}