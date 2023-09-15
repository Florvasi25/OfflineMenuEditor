import {
    jsonData,
    updateSectionLocalStorage,
    getSectionIndex,
    getDragAfterElement,
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
        if (sectionRow.classList.contains('expanded')) {
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

let draggable = null;

sectionContainer.addEventListener('dragenter', e => {
    if (document.querySelector('.expanded')) return; // Si hay alguna sección expandida, no hagas nada.
    e.preventDefault()
    const afterElement = getDragAfterElement(sectionContainer, e.clientY)
    draggable = document.querySelector('.dragging')
    if (afterElement == null) {
        sectionContainer.appendChild(draggable)
    } else {
        sectionContainer.insertBefore(draggable, afterElement)
    }
})


sectionContainer.addEventListener("dragend", () => {
    if (document.querySelector('.expanded')) return;
    const rows = Array.from(sectionContainer.querySelectorAll(".sectionRow"));
    const draggedIdSection = draggable.getAttribute("id");
    const indexSection = getSectionIndex(draggedIdSection); 
    const indexNewPosition = rows.indexOf(draggable);

    if(indexSection !== indexNewPosition) {
        const sectionToMove = jsonData.MenuSections.splice(indexSection, 1)[0];
        jsonData.MenuSections.splice(indexNewPosition, 0, sectionToMove);
        jsonData.MenuSections.forEach((obj, indexSection) => {
            obj.DisplayOrder = indexSection;
        });
        updateSectionLocalStorage()
    }
})

export { createSectionDragCell }