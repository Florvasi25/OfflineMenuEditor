import {
    jsonData,
    updateSectionLocalStorage,
    getItemIndex,
} from './context.js';

import {
    showToolTip
} from './toolTip.js'

function createItemDragCell(itemRow) {
    const itemDragCell = document.createElement('td')
    itemDragCell.className = 'sectionDragCell'
    const itemDragImg = document.createElement('img')
    itemDragImg.src = '../../assets/dragIcon.svg'
    itemDragImg.className = 'sectionDragImg'
    itemDragCell.appendChild(itemDragImg)

    itemDragImg.addEventListener('dragstart', () => {
        if (itemRow.classList.contains('expanded')) return; // Si hay alguna sección expandida, no hagas nada.
        itemRow.classList.add('dragging')
    })

    itemDragImg.addEventListener('mouseover', () => {
        if (itemRow.classList.contains('expanded')) {
            showToolTip(itemDragCell, "You must close all items before moving it.");
        }
    })

    itemDragImg.addEventListener('dragend', () => {
        if (itemRow.classList.contains('expanded')) return;
        itemRow.classList.remove('dragging')
        itemRow.classList.remove('clickOnDrag')
    })

    itemDragImg.addEventListener('mousedown', () => {
        if (itemRow.classList.contains('expanded')) return;
        itemRow.classList.add('clickOnDrag')
    })

    itemDragImg.addEventListener('mouseup', () => {
        if (itemRow.classList.contains('expanded')) return;
        itemRow.classList.remove('clickOnDrag')
    })

    return itemDragCell
}

export { 
    createItemDragCell
 }