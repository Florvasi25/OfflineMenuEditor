import {
    jsonData,
    getSectionIndex,
    updateCounterLocalStorage,
    updateSectionLocalStorage,
} from './context.js';

function sectionDeleteButton(sectionNameCell, sectionRow, sectionName) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton')
    sectionNameCell.appendChild(deleteButton);
    const deleteButtonImg = document.createElement('img')
    deleteButtonImg.classList.add('deleteButtonImg')
    deleteButtonImg.src = '../../assets/deleteIcon.svg'
    deleteButton.appendChild(deleteButtonImg)
    deleteButton.addEventListener('click', () => {
        confirmDelete(sectionRow, sectionName, sectionNameCell)
    });
}

//Creates a popup to confirm the deletion of the section
function confirmDelete(sectionRow, sectionName, sectionNameCell) {
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
    sectionNameCell.appendChild(popup);

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
