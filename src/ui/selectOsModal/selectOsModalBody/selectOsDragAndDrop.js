import {
    updateLocalStorage,
    getDragAfterElement,
    groupedOs,
    jsonData
} from '../../context.js';

function createOsDrag(selectOsBodyRight, selectOsRowHeader, foundItem) {
    const osDragCell = document.createElement('div');
    osDragCell.className = 'osDragCell';
    const osDragImg = document.createElement('img');
    osDragImg.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path fill="#ffffff" d="M349.911-160Q321-160 300.5-180.589q-20.5-20.588-20.5-49.5Q280-259 300.589-279.5q20.588-20.5 49.5-20.5Q379-300 399.5-279.411q20.5 20.588 20.5 49.5Q420-201 399.411-180.5q-20.588 20.5-49.5 20.5Zm260 0Q581-160 560.5-180.589q-20.5-20.588-20.5-49.5Q540-259 560.589-279.5q20.588-20.5 49.5-20.5Q639-300 659.5-279.411q20.5 20.588 20.5 49.5Q680-201 659.411-180.5q-20.588 20.5-49.5 20.5Zm-260-250Q321-410 300.5-430.589q-20.5-20.588-20.5-49.5Q280-509 300.589-529.5q20.588-20.5 49.5-20.5Q379-550 399.5-529.411q20.5 20.588 20.5 49.5Q420-451 399.411-430.5q-20.588 20.5-49.5 20.5Zm260 0Q581-410 560.5-430.589q-20.5-20.588-20.5-49.5Q540-509 560.589-529.5q20.588-20.5 49.5-20.5Q639-550 659.5-529.411q20.5 20.588 20.5 49.5Q680-451 659.411-430.5q-20.588 20.5-49.5 20.5Zm-260-250Q321-660 300.5-680.589q-20.5-20.588-20.5-49.5Q280-759 300.589-779.5q20.588-20.5 49.5-20.5Q379-800 399.5-779.411q20.5 20.588 20.5 49.5Q420-701 399.411-680.5q-20.588 20.5-49.5 20.5Zm260 0Q581-660 560.5-680.589q-20.5-20.588-20.5-49.5Q540-759 560.589-779.5q20.588-20.5 49.5-20.5Q639-800 659.5-779.411q20.5 20.588 20.5 49.5Q680-701 659.411-680.5q-20.588 20.5-49.5 20.5Z"/></svg>');
    osDragImg.className = 'osDragImg';
    
    osDragCell.appendChild(osDragImg);
    
    

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
        
            const osContainerPreviewArray = Array.from(document.getElementsByClassName('osContainer'));
            console.log('osContainerPreviewArray', osContainerPreviewArray);
            
            const osContainerPreview = osContainerPreviewArray.find((p) => { 
                console.log('p.id', p.id,)
                console.log('p', p,)
                console.log('foundItem.id', foundItem.MenuItemId)
                console.log('foundItem', foundItem)
                return p.id == foundItem.MenuItemId});
            console.log('osContainerPreview', osContainerPreview);
             
            const osRowHeaderPreviewArray = Array.from(document.getElementsByClassName('osRowHeader'));
            const osRowOptionPreview = osRowHeaderPreviewArray.find((p) => {
                return p.id == draggable.id;
            });

            
            if (afterElement == null) {
                console.log('afterElement', afterElement);
                osContainerPreview.appendChild(osRowOptionPreview)
            } else {
                const afterElementPreview = osRowHeaderPreviewArray.find((p) => p.id == afterElement.id)
                osContainerPreview.insertBefore(osRowOptionPreview, afterElementPreview)
            }
        })
        
        selectOsBodyRight.addEventListener("dragend", () => {
            const rows = Array.from(selectOsBodyRight.querySelectorAll(".selectOsRowHeader"));
            const draggedIdOs = draggable.getAttribute("id");
            const osIndex = foundItem.MenuItemOptionSets.findIndex(os => os.MenuItemOptionSetId == draggedIdOs)
            const indexNewPosition = rows.indexOf(draggable);
            
            if(osIndex !== indexNewPosition) {
                const osToMove = foundItem.MenuItemOptionSets.splice(osIndex, 1)[0];
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