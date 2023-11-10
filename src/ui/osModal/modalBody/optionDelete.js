import {
    updateOptionSetItemsCounterLocalStorage,
    updateLocalStorage,
    groupedOs,
    setColorOfRows,
    groupOptionSets,
    updateOsDomIds,
    itemlessOs,
    addItemlessOs,
    deleteItemlessOs
} from '../../context.js';

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
    const optionToDelete = optionRow.id;
    const oldGroupOsId = menuOs.groupOsId;
    
    if (optionToDelete) {
        optionRow.remove();

        if (groupedOs[oldGroupOsId]) {
            groupedOs[menuOs.groupOsId].forEach(os => {
                const optionIndex = os.MenuItemOptionSetItems.findIndex(option => option.groupOptionId == optionToDelete)
                os.MenuItemOptionSetItems.splice(optionIndex, 1)
                os.MenuItemOptionSetItems.forEach((obj, index) => {
                    obj.DisplayOrder = index;
                })
                updateOptionSetItemsCounterLocalStorage(menuOption.MenuItemOptionSetItems, false);
                groupOptionSets()
                updateLocalStorage();

                updatePreview(menuOption)
                updateOsDomIds(menuOs, oldGroupOsId);
            })
        } else if (itemlessOs[oldGroupOsId]) {
            const optionIndex = itemlessOs[oldGroupOsId].MenuItemOptionSetItems.findIndex(option => option.groupOptionId == optionToDelete)
            itemlessOs[oldGroupOsId].MenuItemOptionSetItems.splice(optionIndex, 1)
            itemlessOs[oldGroupOsId].MenuItemOptionSetItems.forEach((obj, index) => {
                obj.DisplayOrder = index;
            })

            addItemlessOs(itemlessOs[oldGroupOsId]);
            deleteItemlessOs(oldGroupOsId);
        }

        setColorOfRows(optionRowsContainer)
    }
}

function updatePreview(menuOption) {
    const osRowOption = document.getElementsByClassName('osRowOption')
    const osRowOptionPreviewArray = Array.from(osRowOption);
    
    osRowOptionPreviewArray.forEach(osRowOptionPreview => {
        if (osRowOptionPreview.id === menuOption.groupOptionId) {
            osRowOptionPreview.remove()
        }
    });
}

export { optionDeleteButton }
