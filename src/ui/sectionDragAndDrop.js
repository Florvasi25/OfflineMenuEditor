import {
    jsonData,
    updateSectionLocalStorage,
    getSectionIndex,
} from './context.js';

import {
    showToolTip
} from './toolTip.js'

function createSectionDragCell(sectionRow) {
    const sectionDragCell = document.createElement('td')
    sectionDragCell.className = 'sectionDragCell'
    const sectionDragImg = document.createElement('img')
    sectionDragImg.src = '../../assets/dragIcon.svg'
    sectionDragImg.className = 'sectionDragImg'
    sectionDragCell.appendChild(sectionDragImg)

    sectionDragImg.addEventListener('dragstart', () => {
        if (sectionRow.classList.contains('expanded')) return; // Si hay alguna sección expandida, no hagas nada.
        sectionRow.classList.add('dragging')
    })

    sectionDragImg.addEventListener('mouseover', () => {
        
        if (sectionRow.classList.contains('expanded'))
        {
            showToolTip(sectionDragCell, "You must close all sections before moving it.");
        }
    })

    sectionDragImg.addEventListener('dragend', () => {
        if (sectionRow.classList.contains('expanded')) return;
        sectionRow.classList.remove('dragging')
        sectionRow.classList.remove('clickOnDrag')
    })

    sectionDragImg.addEventListener('mousedown', () => {
        if (sectionRow.classList.contains('expanded')) return;
        sectionRow.classList.add('clickOnDrag')
    })

    sectionDragImg.addEventListener('mouseup', () => {
        if (sectionRow.classList.contains('expanded')) return;
        sectionRow.classList.remove('clickOnDrag')
    })

    return sectionDragCell
}

function getDragAfterElement(outputContainer, y) {
    const draggableElements = [...outputContainer.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element 
}

let draggable = null;

outputContainer.addEventListener('dragenter', e => {
    if (document.querySelector('.expanded')) return; // Si hay alguna sección expandida, no hagas nada.
    e.preventDefault()
    const afterElement = getDragAfterElement(outputContainer, e.clientY)
    draggable = document.querySelector('.dragging')
    if (afterElement == null) {
        outputContainer.appendChild(draggable)
    } else {
        outputContainer.insertBefore(draggable, afterElement)
    }
})


outputContainer.addEventListener("dragend", () => {
    if (document.querySelector('.expanded')) return;
    const rows = Array.from(outputContainer.querySelectorAll("tr"));
    const sectionid = draggable.getAttribute("id");
    const index = getSectionIndex(sectionid); 
    const indexNewPosition = rows.indexOf(draggable);

    if(index !== indexNewPosition) {
        const sectionToMove = jsonData.MenuSections.splice(index, 1)[0];
        jsonData.MenuSections.splice(indexNewPosition, 0, sectionToMove);
        jsonData.MenuSections.forEach((obj, index) => {
            obj.DisplayOrder = index;
        });
        updateSectionLocalStorage()
    }
})

export { createSectionDragCell }