import {
    updateLocalStorage,
    getDragAfterElement,
    groupedOs,
    jsonData
} from '../../context.js';

function createOsDrag(selectOsBodyRight, selectOsRowHeader, foundItem) {
    const osDragCell = document.createElement('div')
    osDragCell.className = 'sectionDragCell'
    const osDragImg = document.createElement('img')
    osDragImg.src = '../../assets/dragIcon.svg'
    osDragImg.className = 'sectionDragImg'
    osDragCell.appendChild(osDragImg)

    osDragImg.addEventListener('dragstart', () => {
        selectOsRowHeader.classList.add('dragging')

        selectOsBodyRight.addEventListener('dragenter', e => {
            e.preventDefault()
            const afterElement = getDragAfterElement(selectOsBodyRight, e.clientY)
            draggable = document.querySelector('.dragging')
        
            if (afterElement == null) {
                selectOsBodyRight.appendChild(draggable)
            } else {
                selectOsBodyRight.insertBefore(draggable, afterElement)
            }
        
            // const optionContainerPreviewArray = Array.from(document.getElementsByClassName('optionContainer'));
            
            // optionContainerPreviewArray.forEach(optionContainerPreview => {
            //     const groupOsId = optionContainerPreview.getAttribute('groupOsId');
                
            //     if (groupOsId === osGroup.groupOsId) {
            //         const osRowOptionPreviewArray = Array.from(optionContainerPreview.getElementsByClassName('osRowOption'));
            //         const osRowOptionPreview = osRowOptionPreviewArray.find((p) => p.id == draggable.id)
            //         if (afterElement == null) {
            //             optionContainerPreview.appendChild(osRowOptionPreview)
            //         } else {
            //             const afterElementPreview = osRowOptionPreviewArray.find((p) => p.id == afterElement.id)
            //             optionContainerPreview.insertBefore(osRowOptionPreview, afterElementPreview)
            //         }        
            //     }
            // });
        })
        
        selectOsBodyRight.addEventListener("dragend", () => {
            const rows = Array.from(selectOsBodyRight.querySelectorAll(".selectOsRowHeader"));
            const draggedIdOs = draggable.getAttribute("id");
            const osIndex = foundItem.MenuItemOptionSets.findIndex(os => os.groupOsId == draggedIdOs)
            console.log(osIndex);
            const indexNewPosition = rows.indexOf(draggable);
            
            if(osIndex !== indexNewPosition) {
                const osToMove = foundItem.MenuItemOptionSets.splice(osIndex, 1)[0];
                console.log('osToMove', osToMove);
                foundItem.MenuItemOptionSets.splice(indexNewPosition, 0, osToMove);
                foundItem.MenuItemOptionSets.forEach((obj, osIndex) => {
                    obj.DisplayOrder = osIndex;
                })
            
                updateLocalStorage()
            }
        })
    })

    osDragImg.addEventListener('dragend', () => {
        selectOsRowHeader.classList.remove('dragging');
        
        const rows = Array.from(selectOsBodyRight.querySelectorAll(".selectOsRowHeader"));
    
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

    return osDragCell
}

let draggable = null;

function setDragListeners(selectOsBodyRight) {
}

export {
    createOsDrag,
    setDragListeners
}