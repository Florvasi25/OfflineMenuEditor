import {
    updateLocalStorage,
    getDragAfterElement
} from '../../context.js';

import {
    showToolTip,
    removeToolTip
} from '../../toolTip.js'

function createOsDrag(selectOsBodyRight, selectOsRowHeader, foundItem) {
    const osDragCell = document.createElement('div');
    osDragCell.className = 'osDragCell';
    const osDragImg = document.createElement('img');
    osDragImg.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path fill="#ffffff" d="M349.911-160Q321-160 300.5-180.589q-20.5-20.588-20.5-49.5Q280-259 300.589-279.5q20.588-20.5 49.5-20.5Q379-300 399.5-279.411q20.5 20.588 20.5 49.5Q420-201 399.411-180.5q-20.588 20.5-49.5 20.5Zm260 0Q581-160 560.5-180.589q-20.5-20.588-20.5-49.5Q540-259 560.589-279.5q20.588-20.5 49.5-20.5Q639-300 659.5-279.411q20.5 20.588 20.5 49.5Q680-201 659.411-180.5q-20.588 20.5-49.5 20.5Zm-260-250Q321-410 300.5-430.589q-20.5-20.588-20.5-49.5Q280-509 300.589-529.5q20.588-20.5 49.5-20.5Q379-550 399.5-529.411q20.5 20.588 20.5 49.5Q420-451 399.411-430.5q-20.588 20.5-49.5 20.5Zm260 0Q581-410 560.5-430.589q-20.5-20.588-20.5-49.5Q540-509 560.589-529.5q20.588-20.5 49.5-20.5Q639-550 659.5-529.411q20.5 20.588 20.5 49.5Q680-451 659.411-430.5q-20.588 20.5-49.5 20.5Zm-260-250Q321-660 300.5-680.589q-20.5-20.588-20.5-49.5Q280-759 300.589-779.5q20.588-20.5 49.5-20.5Q379-800 399.5-779.411q20.5 20.588 20.5 49.5Q420-701 399.411-680.5q-20.588 20.5-49.5 20.5Zm260 0Q581-660 560.5-680.589q-20.5-20.588-20.5-49.5Q540-759 560.589-779.5q20.588-20.5 49.5-20.5Q639-800 659.5-779.411q20.5 20.588 20.5 49.5Q680-701 659.411-680.5q-20.588 20.5-49.5 20.5Z"/></svg>');
    osDragImg.className = 'osDragImg';

    osDragCell.appendChild(osDragImg);

    osDragImg.addEventListener('mouseover', (e) => {
        if (selectOsRowHeader.classList.contains('expanded')) {
            showToolTip(osDragCell, "You must close all OS before moving it.");
        }
        e.stopPropagation();
    })

    // Add an event listener to the sectionRow to watch for class changes
    selectOsRowHeader.addEventListener('transitionend', () => {
        if (selectOsRowHeader.classList.contains('folded')) {
            // Remove the tooltip if the section is folded
            removeToolTip(osDragCell);
        }
    });

    osDragImg.addEventListener('dragstart', e => {
        const expandedOsInContainer = selectOsRowHeader.parentElement.querySelector('.expanded');
        if (expandedOsInContainer) {
            e.preventDefault();
            return;
        }
        selectOsRowHeader.classList.add('dragging')
        e.stopPropagation();

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
            const osContainerPreview = osContainerPreviewArray.find((p) => p.id == foundItem.MenuItemId);

            const osRowHeaderPreviewArray = Array.from(document.getElementsByClassName('osRowHeader'));
            const osRowOptionPreview = osRowHeaderPreviewArray.find((p) => p.id == draggable.id);

            if (afterElement == null) {
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

        const selectOsRowHeaders = Array.from(selectOsBodyRight.querySelectorAll(".selectOsRowHeader"));

        selectOsRowHeaders.forEach((selectOsRowHeader, index) => {
            if (index % 2 === 0) {
                selectOsRowHeader.classList.remove('even');
                selectOsRowHeader.classList.add('odd');
            } else {
                selectOsRowHeader.classList.remove('odd');
                selectOsRowHeader.classList.add('even');
            }
        });

        const osRowHeadersPreview = Array.from(document.getElementsByClassName('osRowHeader'))

        osRowHeadersPreview.forEach((osRowHeaderPreview, index) => {
            if (index % 2 === 0) {
                osRowHeaderPreview.classList.remove('even');
                osRowHeaderPreview.classList.add('odd');
            } else {
                osRowHeaderPreview.classList.remove('odd');
                osRowHeaderPreview.classList.add('even');
            }
        });
    });

    return osDragCell
}

let draggable = null;

export { createOsDrag }