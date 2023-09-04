import {
    jsonData,
    getItemIndex,
    updateCounterLocalStorage,
    updateSectionLocalStorage,
} from './context.js';

function itemDeleteButton(itemButtonsCell, itemRow, itemName, sectionId) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('sectionButton')
    deleteButton.classList.add('deleteButton')
    itemButtonsCell.appendChild(deleteButton);
    const deleteButtonImg = document.createElement('img')
    deleteButtonImg.classList.add('sectionButtonImg')
    deleteButtonImg.src = '../../assets/deleteIcon.svg'
    deleteButton.appendChild(deleteButtonImg)
    deleteButton.addEventListener('click', () => {
        confirmDelete(itemRow, itemName, itemButtonsCell, sectionId)
    });
}


//Creates a popup to confirm the deletion of the section
function confirmDelete(itemRow, itemName, itemButtonsCell, sectionId) {
    const popup = document.createElement("div");
    popup.className = "popup";

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `
        <p>Do you want to delete permanently "${itemName.textContent}"</p>
        <button class="yesButton">Yes</button>
        <button class="noButton">No</button>
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

//Deletes Section from UI and LS
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
            updateCounterLocalStorage(itemId, false);
        }
    }
}

export {
    itemDeleteButton,
}
