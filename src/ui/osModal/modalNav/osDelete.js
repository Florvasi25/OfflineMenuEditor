import {
    updateOptionSetCounterLocalStorage,
    updateLocalStorage,
    groupedOs,
    jsonData,
    setColorOfRows,
    groupOptionSets,
    itemlessOs,
    updateItemlessLocalStorage
} from '../../context.js';

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
        // deleteOs(menuOs, menuOption, optionRow, optionRowsContainer);
        deleteOs2(menuOs);
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

function deleteOs2(menuOs) {
    if (groupedOs[menuOs.groupOsId]) {
        // find all the ids to remove
        const osIds = groupedOs[menuOs.groupOsId].map(os => os.MenuItemOptionSetId);
        // delete groupOs reference to these os
        delete groupedOs[menuOs.groupOsId];
        // delete jsonData reference to these os
        jsonData.MenuSections.flatMap(i => i.MenuItems).forEach(i => {
            i.MenuItemOptionSets = i.MenuItemOptionSets.filter(os => !osIds.includes(os.MenuItemOptionSetId))
        })
        updatePreview(osIds.map(p => p.toString()))
        updateOptionSetCounterLocalStorage(menuOs.MenuItemOptionSets, false);
        groupOptionSets()
        updateLocalStorage();
    } else if (itemlessOs.includes(menuOs)){
        itemlessOs.pop(menuOs)
        updateItemlessLocalStorage();
    }

    const existingOsModal = document.querySelector('.osModalContainer')
    if (existingOsModal) {
        existingOsModal.classList.remove('show');
        existingOsModal.classList.add('hide');
        setTimeout(() => {
            existingOsModal.style.display = 'none';
            existingOsModal.classList.remove('hide');
            existingOsModal.remove()
        }, 300);
    }
}

// //Deletes item from UI and LS
// function deleteOs(menuOs, menuOption, optionRow, optionRowsContainer) {
//     const groupOsId = menuOs.groupOsId;

    
//     const foundItem = jsonData.MenuSections.flatMap(i => i.MenuItems).find(i => i.MenuItemId == itemRowId)
    
//     const indexOfOs = foundItem.MenuItemOptionSets.findIndex(
//         os => os.MenuItemOptionSetId == menuOption.MenuItemOptionSetId
//     )
//     // optionRow.remove();

//     if (indexOfOs) {
//         // updatePreview(indexOfOs, menuOs)

//         foundItem.forEach(os => {
//             os.MenuItemOptionSets.splice(indexOfOs, 1)
//             os.MenuItemOptionSets.forEach((obj, index) => {
//                 obj.DisplayOrder = index;
//             })
//             updateOptionSetItemsCounterLocalStorage(menuOption.MenuItemOptionSetItems, false);
//             groupOptionSets()
//             updateLocalStorage();
//         })
//     } else if (itemlessOs.includes(menuOs)){
//         menuOs.MenuItemOptionSetItems.splice(indexOfOs, 1)
//         menuOs.MenuItemOptionSetItems.forEach((obj, index) => {
//             obj.DisplayOrder = index;
//         })

//         updateItemlessLocalStorage();
//     }

//     setColorOfRows(optionRowsContainer)
// }

function updatePreview(osIds) {
    const osRowHeaderPreviewArray = Array.from(document.getElementsByClassName('osRowHeader'));
    // const osRowHeaderPreview = osRowHeaderPreviewArray.filter(p => p.id == osIds.toString());
    const osRowHeaderPreview = osRowHeaderPreviewArray.filter(p => osIds.includes(p.id));
    if (osRowHeaderPreview) {
        osRowHeaderPreview.forEach(os => {
            os.remove()
        })
    }
}

export { osDeleteButton }
