import {
    updateLocalStorage,
    groupedOs,
    jsonData,
    groupOptionSets,
    itemlessOs,
    updateItemlessLocalStorage,
    closeOsModalContainer,
    addWarningMoM
} from '../../context.js';

import {
    showToolTip
} from '../../toolTip.js';

import { slotManagerInstance } from  "../../mainContainer.js";

function osDeleteButton(osBtnsCell, menuOs) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('sectionButton')
    deleteButton.classList.add('deleteButton')
    osBtnsCell.appendChild(deleteButton);
    const deleteButtonImg = document.createElement('img')
    deleteButtonImg.classList.add('sectionButtonImg')
    deleteButtonImg.src = '../../assets/deleteIcon.svg'
    deleteButton.appendChild(deleteButtonImg)

    deleteButton.addEventListener('click', () => {
        confirmDelete(menuOs, osBtnsCell);
    });
}

//Creates a popup to confirm the deletion of the item
function confirmDelete(menuOs, osBtnsCell) {
    const popup = document.createElement("div");
    popup.className = "popup";

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `
        <p>Do you want to delete permanently "${menuOs.Name}"</p>
        <button class="yesButton confirmDeleteBtn">Yes</button>
        <button class="noButton confirmDeleteBtn">No</button>`

    popupContent.querySelector(".yesButton").addEventListener("click", function () {
        deleteOs(menuOs);
        addWarningMoM()
        popup.remove();
    });

    popupContent.querySelector(".noButton").addEventListener("click", function () {
        popup.remove();
    });

    popup.appendChild(popupContent);
    osBtnsCell.appendChild(popup);

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

function deleteOs(menuOs) {
    if (groupedOs[menuOs.groupOsId]) {

        // find all the ids to remove
        const osIds = groupedOs[menuOs.groupOsId].map(os => os.MenuItemOptionSetId);
        // delete groupOs reference to these os
        delete groupedOs[menuOs.groupOsId];
        // delete jsonData reference to these os
        jsonData.MenuSections.flatMap(i => i.MenuItems).forEach(i => {
            i.MenuItemOptionSets = i.MenuItemOptionSets.filter(os => !osIds.includes(os.MenuItemOptionSetId))
        })
        updatePreview(osIds.map(p => p.toString()));
        groupOptionSets();
        updateLocalStorage(slotManagerInstance.currentSlot);
    } else if (itemlessOs.includes(menuOs)){
        itemlessOs.pop(menuOs)
        updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
    }

    closeOsModalContainer()
}

function updatePreview(osIds) {
    const osRowHeaderPreviewArray = Array.from(document.getElementsByClassName('osRowHeader'));
    const osRowHeaderPreview = osRowHeaderPreviewArray.filter(p => osIds.includes(p.id));
    if (osRowHeaderPreview) {
        osRowHeaderPreview.forEach(os => {
            if (os.classList.contains('expanded')) {
                let option = os.nextElementSibling;
                if (option.tagName === 'DIV' && option.classList.contains('optionContainer')) {
                    option.remove();
                }
            }
            os.remove()
        })
    }

    const osRowHeadersPreview = Array.from(document.getElementsByClassName('osRowHeader'))
        
    osRowHeadersPreview.forEach((osRowHeaderPreview, index) => {
        if (index % 2 === 0) {
            osRowHeaderPreview.classList.remove('even');
            osRowHeaderPreview.classList.add('odd');
        } else {
            osRowHeaderPreview.classList.remove('odd');
            osRowHeaderPreview.classList.add('even');
        }
    });
}

export { 
    osDeleteButton,
    deleteOs
}
