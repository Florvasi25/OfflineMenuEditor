import {
    updateLocalStorage,
    getDragAfterElement,
    groupedOs,
    groupOptionSets,
    updateOsDomIds,
    itemlessOs,
    updateItemlessOsKey
} from '../../context.js';

function createOptionDragCell(optionRowsContainer, optionRow) {
    const optionDragCell = document.createElement('div')
    optionDragCell.className = 'sectionDragCell'
    const optionDragImg = document.createElement('img')
    optionDragImg.src = '../../assets/dragIcon.svg'
    optionDragImg.className = 'sectionDragImg'
    optionDragCell.appendChild(optionDragImg)

    optionDragImg.addEventListener('dragstart', () => {
        optionRow.classList.add('dragging')
    })

    optionDragImg.addEventListener('dragend', () => {
        optionRow.classList.remove('dragging');
        
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
    });

    return optionDragCell
}

let draggable = null;
let afterElement = null

function setDragListeners(optionRowsContainer, menuOs) {
    optionRowsContainer.addEventListener('dragenter', e => {
        e.preventDefault()
        afterElement = getDragAfterElement(optionRowsContainer, e.clientY)
        draggable = document.querySelector('.dragging')

        if (afterElement == null) {
            optionRowsContainer.appendChild(draggable)
        } else {
            optionRowsContainer.insertBefore(draggable, afterElement)
        }

    })

    optionRowsContainer.addEventListener("dragend", () => {
        const rows = Array.from(optionRowsContainer.querySelectorAll(".optionRow"));
        const draggedIdOption = draggable.getAttribute("id");
        const indexNewPosition = rows.indexOf(draggable);
        
        const oldGroupOsId = menuOs.groupOsId;
        
        if (groupedOs[oldGroupOsId]) {
            const indexOfOption = menuOs.MenuItemOptionSetItems.findIndex(
                option => option.MenuItemOptionSetItemId == draggedIdOption
            )
            if(indexOfOption !== indexNewPosition) {
                groupedOs[menuOs.groupOsId].forEach(os => {
                    const optionToMove = os.MenuItemOptionSetItems.splice(indexOfOption, 1)[0];
                    const afterOption = os.MenuItemOptionSetItems[indexNewPosition];
                    os.MenuItemOptionSetItems.splice(indexNewPosition, 0, optionToMove);
                    os.MenuItemOptionSetItems.forEach((obj, index) => {
                        obj.DisplayOrder = index;
                    })

                    updatePreview(optionToMove, afterOption)

                }) 
                groupOptionSets()
                updateLocalStorage()
            } 
        } else if (itemlessOs[oldGroupOsId]) {
            const optionItemlessIndex = itemlessOs[oldGroupOsId].MenuItemOptionSetItems[indexOfOption]
            if(optionItemlessIndex !== indexNewPosition) {
                const optionToMove = itemlessOs[oldGroupOsId].MenuItemOptionSetItems.splice(optionItemlessIndex, 1)[0];
                console.log('optionToMove', optionToMove);
                itemlessOs[oldGroupOsId].MenuItemOptionSetItems.splice(indexNewPosition, 0, optionToMove);
                itemlessOs[oldGroupOsId].MenuItemOptionSetItems.forEach((obj, optionItemlessIndex) => {
                    obj.DisplayOrder = optionItemlessIndex;
                })
            }
            updateItemlessOsKey(oldGroupOsId)
        }
    })
}

function updatePreview(optionToMove, afterOption) {
    const osRowOptionPreviewArray = Array.from(document.getElementsByClassName('osRowOption'));
    const osRowOptionPreview = osRowOptionPreviewArray.find(
        p => p.id == optionToMove.MenuItemOptionSetItemId
    );

    if (osRowOptionPreview) {
        if (afterOption == null) {
            osRowOptionPreview.parentNode.appendChild(osRowOptionPreview)
        } else {
            const afterElementPreview = osRowOptionPreviewArray.find((p) => p.id == afterOption.MenuItemOptionSetItemId)
            osRowOptionPreview.parentNode.insertBefore(osRowOptionPreview, afterElementPreview)
        }
    }
}

export {
    createOptionDragCell,
    setDragListeners
}