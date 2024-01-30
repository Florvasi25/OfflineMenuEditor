import {
    jsonData,
    updateLocalStorage,
    getItemIndex,
    getDragAfterElement,
} from '../context.js';

import { showToolTip } from '../toolTip.js'

function createItemDragCell(itemRow) {
    const itemDragCell = document.createElement('div')
    itemDragCell.className = 'sectionDragCell'
    const itemDragImg = document.createElement('img')
    itemDragImg.src = '../../assets/dragIcon.svg'
    itemDragImg.className = 'sectionDragImg'
    itemDragCell.appendChild(itemDragImg)

    itemDragImg.addEventListener('mouseover', (e) => {
        if (itemRow.classList.contains('expanded')) {
            showToolTip(itemDragCell, "You must close all Items before moving it");
        }
        e.stopPropagation();
    })
    
    itemDragImg.addEventListener('dragstart', (e) => {
        const expandedItemsInContainer = itemRow.parentElement.querySelector('.expanded');
        if (expandedItemsInContainer) {
            e.preventDefault();
            return;
        }
        itemRow.classList.add('dragging');
        e.stopPropagation();
    
        const itemContainer = itemRow.parentElement;
    
        itemContainer.addEventListener('dragenter', e => {
            const draggingItemContainer = document.querySelector('.dragging').parentElement;
            if (itemContainer !== draggingItemContainer) {
                e.preventDefault();
                return;
            }
    
            e.preventDefault();
            const afterElement = getDragAfterElement(itemContainer, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                itemContainer.appendChild(draggable);
            } else {
                itemContainer.insertBefore(draggable, afterElement);
            }
            e.stopPropagation();
        });
    
        itemDragImg.addEventListener("dragend", (e) => {
            // Access the sectionRow id
            const itemTable = itemRow.closest('.itemTable');
            const sectionRow = itemTable ? itemTable.previousElementSibling : null;
            const sectionId = sectionRow ? sectionRow.getAttribute("id") : null;
        
            const rows = Array.from(itemDragImg.parentElement.querySelectorAll(".itemRow")); // Get rows from the current itemContainer
            const draggedIdItem = itemRow.getAttribute("id");
            const {itemIndex, sectionIndex} = getItemIndex(sectionId, draggedIdItem);
            const indexNewPosition = rows.indexOf(itemRow);
            
            if(itemIndex !== indexNewPosition) {
                const sectionToMove = jsonData.MenuSections[sectionIndex].MenuItems.splice(itemIndex, 1)[0];
                jsonData.MenuSections[sectionIndex].MenuItems.splice(indexNewPosition, 0, sectionToMove);
                jsonData.MenuSections[sectionIndex].MenuItems.forEach((obj, itemIndex) => {
                    obj.DisplayOrder = itemIndex;
                });
                updateLocalStorage();
            }
            e.stopPropagation();
        });
    });

    itemDragImg.addEventListener('dragend', (e) => {
        itemRow.classList.remove('dragging')
        e.stopPropagation();
    })

    return itemDragCell
}

export { createItemDragCell }
