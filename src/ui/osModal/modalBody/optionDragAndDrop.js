import {
    jsonData,
    updateSectionLocalStorage,
    getDragAfterElement,
    getOptionIndex,
    getItemIndex
} from '../../context.js';

function createOptionDragCell(optionsContainer, optionRow) {
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
        optionRow.classList.remove('clickOnDrag');
        
        const rows = Array.from(optionsContainer.querySelectorAll(".optionRow"));
    
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
    
    
    optionDragImg.addEventListener('mousedown', () => {
        optionRow.classList.add('clickOnDrag')
    })

    optionDragImg.addEventListener('mouseup', () => {
        optionRow.classList.remove('clickOnDrag')
    })

    return optionDragCell
}

let draggable = null;

function setDragListeners(optionsContainer, sectionId, itemId, osId) {
    optionsContainer.addEventListener('dragenter', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(optionsContainer, e.clientY)
        draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            optionsContainer.appendChild(draggable)
        } else {
            optionsContainer.insertBefore(draggable, afterElement)
        }
    })
    
    
    optionsContainer.addEventListener("dragend", () => {
        const rows = Array.from(optionsContainer.querySelectorAll(".optionRow"));
        const draggedIdOption = draggable.getAttribute("id");
        const {itemIndex, sectionIndex, osIndex, optionIndex} = getOptionIndex(sectionId, itemId, osId, draggedIdOption)
        const indexNewPosition = rows.indexOf(draggable);
    
        if(optionIndex !== indexNewPosition) {
            const sectionToMove = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems.splice(optionIndex, 1)[0];
            jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems.splice(indexNewPosition, 0, sectionToMove);
            jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems.forEach((obj, optionIndex) => {
                obj.DisplayOrder = optionIndex;
            });

            updateSectionLocalStorage()
        }
    })
}

export {
    createOptionDragCell,
    setDragListeners
 }