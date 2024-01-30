import {
    updateLocalStorage,
    groupedOs,
    setColorOfRows,
    groupOptionSets,
    itemlessOs,
    updateItemlessLocalStorage
} from '../../context.js';

import {
    deleteOs
} from '../modalNav/osDelete.js'

function optionDeleteButton(optionButtonsCell, menuOs, menuOption, optionRow, optionRowsContainer) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('sectionButton')
    deleteButton.classList.add('deleteButton')
    optionButtonsCell.appendChild(deleteButton);
    const deleteButtonImg = document.createElement('img')
    deleteButtonImg.classList.add('sectionButtonImg')
    deleteButtonImg.src = '../../assets/deleteIcon.svg'
    deleteButton.appendChild(deleteButtonImg)

    deleteButton.addEventListener('click', () => {
        confirmDelete(menuOs, menuOption, optionRow, optionButtonsCell, optionRowsContainer)
    });
}

//Creates a popup to confirm the deletion of the item
function confirmDelete(menuOs, menuOption, optionRow, optionButtonsCell, optionRowsContainer) {
    const popup = document.createElement("div");
    popup.className = "popup";

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `
        <p>Do you want to delete permanently "${menuOption.Name}"</p>
        <button class="yesButton confirmDeleteBtn">Yes</button>
        <button class="noButton confirmDeleteBtn">No</button>`

    popupContent.querySelector(".yesButton").addEventListener("click", function () {
        deleteOption(menuOs, menuOption, optionRow, optionRowsContainer);
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
function deleteOption(menuOs, menuOption, optionRow, optionRowsContainer) {
    const groupOsId = menuOs.groupOsId;

    const indexOfOption = menuOs.MenuItemOptionSetItems.findIndex(
        option => option.MenuItemOptionSetItemId == menuOption.MenuItemOptionSetItemId
    )

    optionRow.remove();

    if (groupedOs[groupOsId]) {
        updatePreview(indexOfOption, menuOs)

        groupedOs[groupOsId].forEach(os => {
            os.MenuItemOptionSetItems.splice(indexOfOption, 1)
            os.MenuItemOptionSetItems.forEach((obj, index) => {
                obj.DisplayOrder = index;
            })
            groupOptionSets()
            updateLocalStorage();
        })
    } else if (itemlessOs.includes(menuOs)){
        menuOs.MenuItemOptionSetItems.splice(indexOfOption, 1)
        menuOs.MenuItemOptionSetItems.forEach((obj, index) => {
            obj.DisplayOrder = index;
        })

        updateItemlessLocalStorage();
    }

    setColorOfRows(optionRowsContainer)

    // Check if there are no more options in menuOs
    if (menuOs.MenuItemOptionSetItems.length === 0) {
        deleteOs(menuOs); // Call deleteOs function
    }
}

function updatePreview(indexOfOption, menuOs) {
    const optionsIds = groupedOs[menuOs.groupOsId].map(
        os => os.MenuItemOptionSetItems[indexOfOption].MenuItemOptionSetItemId.toString()
    );
    const osRowOptionPreviewArray = Array.from(document.getElementsByClassName('osRowOption'));
    const osRowOptionPreview = osRowOptionPreviewArray.filter(p => optionsIds.includes(p.id));
    if (osRowOptionPreview) {
        osRowOptionPreview.forEach(os => {
            os.remove()
        })
    }
}

export { optionDeleteButton, deleteOption }
