import {
    updateLocalStorage,
    getDragAfterElement,
    groupedOs
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

function setDragListeners(optionRowsContainer, menuOs) {
    optionRowsContainer.addEventListener('dragenter', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(optionRowsContainer, e.clientY)
        draggable = document.querySelector('.dragging')

        if (afterElement == null) {
            optionRowsContainer.appendChild(draggable)
        } else {
            optionRowsContainer.insertBefore(draggable, afterElement)
        }

        const optionContainerPreviewArray = Array.from(document.getElementsByClassName('optionContainer'));
        
        optionContainerPreviewArray.forEach(optionContainerPreview => {
            const groupOsId = optionContainerPreview.getAttribute('groupOsId');
            
            if (groupOsId === menuOs.groupOsId) {
                const osRowOptionPreviewArray = Array.from(optionContainerPreview.getElementsByClassName('osRowOption'));
                const osRowOptionPreview = osRowOptionPreviewArray.find((p) => p.id == draggable.id)
                if (afterElement == null) {
                    optionContainerPreview.appendChild(osRowOptionPreview)
                } else {
                    const afterElementPreview = osRowOptionPreviewArray.find((p) => p.id == afterElement.id)
                    optionContainerPreview.insertBefore(osRowOptionPreview, afterElementPreview)
                }        
            }
        });
    })

    optionRowsContainer.addEventListener("dragend", () => {
        const rows = Array.from(optionRowsContainer.querySelectorAll(".optionRow"));
        const draggedIdOption = draggable.getAttribute("id");
        const optionIndex = groupedOs[menuOs.groupOsId][0].MenuItemOptionSetItems.findIndex(option => option.groupOptionId == draggedIdOption)
        const indexNewPosition = rows.indexOf(draggable);
        
        if(optionIndex !== indexNewPosition) {
            groupedOs[menuOs.groupOsId].forEach(os => {
                const sectionToMove = os.MenuItemOptionSetItems.splice(optionIndex, 1)[0];
                os.MenuItemOptionSetItems.splice(indexNewPosition, 0, sectionToMove);
                os.MenuItemOptionSetItems.forEach((obj, optionIndex) => {
                    obj.DisplayOrder = optionIndex;
                })
            }) 

            updateLocalStorage()
        }
    })
}

export {
    createOptionDragCell,
    setDragListeners
}