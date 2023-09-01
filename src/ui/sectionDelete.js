import {
    jsonData,
    getSectionIndex,
    updateCounterLocalStorage,
    updateSectionLocalStorage,
} from './context.js';

function sectionDeleteButton(sectionButtonsCell, sectionRow, sectionName) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('sectionButton')
    deleteButton.classList.add('deleteButton')
    sectionButtonsCell.appendChild(deleteButton);
    const deleteButtonImg = document.createElement('img')
    deleteButtonImg.classList.add('sectionButtonImg')
    deleteButtonImg.src = '../../assets/deleteIcon.svg'
    deleteButton.appendChild(deleteButtonImg)
    deleteButton.addEventListener('click', () => {
        confirmDelete(sectionRow, sectionName, sectionButtonsCell)
    });
}

//Creates a popup to confirm the deletion of the section
function confirmDelete(sectionRow, sectionName, sectionButtonsCell) {
    const popup = document.createElement("div");
    popup.className = "popup";

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `
        <p>Do you want to delete permanently "${sectionName.textContent}"</p>
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
function deleteSection(sectionToRemove) {
    const sectionId = sectionToRemove.id;
    if (sectionToRemove) {
        if (sectionToRemove.classList.contains('expanded')) {
            let items = sectionToRemove.nextElementSibling;
            if (items && items.tagName === 'TABLE') {
                items.remove(); // remove items of the section
            }
        }
        sectionToRemove.remove(); 
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

export {
    sectionDeleteButton,
}
