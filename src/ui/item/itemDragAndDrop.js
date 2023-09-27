import {
    jsonData,
    updateSectionLocalStorage,
    getItemIndex,
    getDragAfterElement,
} from '../context.js';

import {
    showToolTip
} from '../toolTip.js'

function createItemDragCell(itemRow) {
    const itemDragCell = document.createElement('div')
    itemDragCell.className = 'sectionDragCell'
    const itemDragImg = document.createElement('img')
    itemDragImg.src = '../../assets/dragIcon.svg'
    itemDragImg.className = 'sectionDragImg'
    itemDragCell.appendChild(itemDragImg)

    itemDragImg.addEventListener('dragstart', () => {
        // if (itemRow.classList.contains('expanded')) return; // Si hay alguna sección expandida, no hagas nada.
        itemRow.classList.add('dragging')
    })

    itemDragImg.addEventListener('mouseover', () => {
        if (itemRow.classList.contains('expanded')) {
            showToolTip(itemDragCell, "You must close all items before moving it.");
        }
    })

    itemDragImg.addEventListener('dragend', () => {
        // if (itemRow.classList.contains('expanded')) return;
        itemRow.classList.remove('dragging')
        itemRow.classList.remove('clickOnDrag')
    })

    itemDragImg.addEventListener('mousedown', () => {
        // if (itemRow.classList.contains('expanded')) return;
        itemRow.classList.add('clickOnDrag')
    })

    itemDragImg.addEventListener('mouseup', () => {
        // if (itemRow.classList.contains('expanded')) return;
        itemRow.classList.remove('clickOnDrag')
    })

    return itemDragCell
}

let draggable = null;

function setDragListeners(itemContainer, sectionId) {
    itemContainer.addEventListener('dragenter', e => {
        // if (document.querySelector('.expanded')) return; // Si hay alguna sección expandida, no hagas nada.
        e.preventDefault()
        const afterElement = getDragAfterElement(itemContainer, e.clientY)
        draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            itemContainer.appendChild(draggable)
        } else {
            itemContainer.insertBefore(draggable, afterElement)
        }
    })
    
    
    itemContainer.addEventListener("dragend", () => {
        // if (document.querySelector('.expanded')) return;
        const rows = Array.from(itemContainer.querySelectorAll(".itemRow"));
        const draggedIdItem = draggable.getAttribute("id");
        const {itemIndex, sectionIndex} = getItemIndex(sectionId, draggedIdItem)
        const indexNewPosition = rows.indexOf(draggable);
    
        if(itemIndex !== indexNewPosition) {
            const sectionToMove = jsonData.MenuSections[sectionIndex].MenuItems.splice(itemIndex, 1)[0];
            jsonData.MenuSections[sectionIndex].MenuItems.splice(indexNewPosition, 0, sectionToMove);
            jsonData.MenuSections[sectionIndex].MenuItems.forEach((obj, itemIndex) => {
                obj.DisplayOrder = itemIndex;
            });
            updateSectionLocalStorage()
        }
    })
}


export {
    createItemDragCell,
    setDragListeners
 }