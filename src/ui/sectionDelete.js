import {
    jsonData,
    getSectionIndex,
    updateCounterLocalStorage,
    updateItemCounterLocalStorage,
    updateSectionLocalStorage,
} from './context.js';

function sectionDeleteButton(sectionButtonsCell, sectionRow) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('sectionButton')
    deleteButton.classList.add('deleteButton')
    sectionButtonsCell.appendChild(deleteButton);
    const deleteButtonImg = document.createElement('img')
    deleteButtonImg.classList.add('sectionButtonImg')
    deleteButtonImg.src = '../../assets/deleteIcon.svg'
    deleteButton.appendChild(deleteButtonImg)
    deleteButton.addEventListener('click', () => {
        confirmDelete(sectionRow, sectionButtonsCell)
    });
}

//Creates a popup to confirm the deletion of the section
function confirmDelete(sectionRow, sectionButtonsCell) {
    const popup = document.createElement("div");
    popup.className = "popup";
    const sectionId = sectionRow.id;
    const sectionObject = jsonData.MenuSections.find(s => s.MenuSectionId == sectionId);

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `
        <p>Do you want to delete permanently "${sectionObject.Name}"</p>
        <button class="yesButton">Yes</button>
        <button class="noButton">No</button>
    `;

    popupContent.querySelector(".yesButton").addEventListener("click", function () {
        deleteSection(sectionRow);
        popup.remove();
    });

    popupContent.querySelector(".noButton").addEventListener("click", function () {
        popup.remove();
    });

    popup.appendChild(popupContent); 
    sectionButtonsCell.appendChild(popup);

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
        // Encuentra la sección en jsonData basada en el ID
        const section = jsonData.MenuSections.find(s => s.MenuSectionId == sectionId);
        deleteItemLocalStorage(section); // delete item ID inside local storage
        if (sectionRow.classList.contains('expanded')) {
            let items = sectionRow.nextElementSibling;
            if (items && items.tagName === 'TABLE') {
                items.remove(); 
            }
        }
        sectionRow.remove(); 
        const sectionIndex = getSectionIndex(sectionId);
        if (sectionIndex !== -1) {
            jsonData.MenuSections.splice(sectionIndex, 1);
            jsonData.MenuSections.forEach((obj, index) => {
                obj.DisplayOrder = index;
            });
            updateSectionLocalStorage();
            updateCounterLocalStorage(sectionId, false);

        }
    }
}

// delete item ID inside local storage
function deleteItemLocalStorage(section) {
    if (section && section.MenuItems) {
        for (const item of section.MenuItems) {
            // Calls updateItemCounterLocalStorage for each item
            updateItemCounterLocalStorage(item.MenuItemId, false);
        }
    }
}
   

export {
    sectionDeleteButton,
}
