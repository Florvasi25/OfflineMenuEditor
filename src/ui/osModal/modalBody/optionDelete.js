import {
    jsonData,
    getOptionIndex,
    updateOptionSetItemsCounterLocalStorage,
    updateLocalStorage,
    groupedOs
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
    const optionId = menuOption.groupOptionId;
    console.log(optionId);

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `
        <p>Do you want to delete permanently "${menuOption.Name}"</p>
        <button class="yesButton confirmDeleteBtn">Yes</button>
        <button class="noButton confirmDeleteBtn">No</button>`

    popupContent.querySelector(".yesButton").addEventListener("click", function () {
        deleteItem(menuOs, menuOption, optionRow, optionRowsContainer);
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
function deleteItem(menuOs, menuOption, optionRow, optionRowsContainer) {
    const optionToDelete = optionRow.id;
    
    if (optionToDelete) {
        optionRow.remove();
        console.log(optionToDelete);
            groupedOs[menuOs.groupOsId].forEach(os => {
                const optionIndex = os.MenuItemOptionSetItems.findIndex(option => option.groupOptionId == optionToDelete)
                os.MenuItemOptionSetItems.splice(optionIndex, 1)
                os.MenuItemOptionSetItems.forEach((obj, index) => {
                    obj.DisplayOrder = index;
                })
            })

            const rows = Array.from(optionRowsContainer.querySelectorAll(".optionRow"));
    
            rows.forEach((row, index) => {
                if (index % 2 === 0) {
                    row.classList.remove('even');
                    row.classList.add('odd');
                } else {
                    row.classList.remove('odd');
                    row.classList.add('even');
                }
            });

            const optionContainerPreviewArray = Array.from(document.getElementsByClassName('optionContainer'));

            const optionContainerPreview = optionContainerPreviewArray.filter((element) => {
              const groupOsId = element.getAttribute('groupOsId');
              return groupOsId === menuOs.groupOsId;
            });
            
            if (optionContainerPreview) {
                optionContainerPreview.forEach((osRowOptionPreview) => {
                    const osRowOptionPreviewArray = Array.from(osRowOptionPreview.getElementsByClassName('osRowOption'));
                    
                    osRowOptionPreviewArray.forEach(osRowOptionPreview => {
                        if (osRowOptionPreview.id === menuOption.groupOptionId) {
                            osRowOptionPreview.remove()
                        }
                    });
                });
            }

            updateLocalStorage();
            updateOptionSetItemsCounterLocalStorage(menuOption.MenuItemOptionSetItems, false);
    }
}

export { optionDeleteButton }
