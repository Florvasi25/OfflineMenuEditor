// function osDuplicateButton(osBtnsCell) {
//     const duplicateButton = document.createElement('button');
//     duplicateButton.classList.add('sectionButton')
//     duplicateButton.classList.add('duplicateButton')
//     osBtnsCell.appendChild(duplicateButton);
//     const duplicateButtonImg = document.createElement('img')
//     duplicateButtonImg.classList.add('sectionButtonImg')
//     duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
//     duplicateButton.appendChild(duplicateButtonImg)
// }

// export { osDuplicateButton }

import {
    jsonData,
    getLocalStorageOptionSetIDs,
    getRandomInt,
    addItemlessOs,
    getUniqueRandomInt,
    groupedOs
} from '../../context.js';

import { newOsModalContainer } from "../modalContainer.js";


function osDuplicateButton(osBtnsCell, menuOs, osModalContainer) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    osBtnsCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)

    duplicateButton.addEventListener('click', () => {
        // if (itemRow.classList.contains('expanded')) return;

        duplicateOs(menuOs, osModalContainer);
        // setSectionDisplayOrder(jsonData);
    });
    
}

function duplicateOs(menuOs, osModalContainer) {

        const newOs = JSON.parse(JSON.stringify(menuOs));
        newOs.Name += "_copy"

        addItemlessOs(newOs)
    
    // if (itemIndex !== -1) {
    //     const originalItem = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex];
    //     const newItem = JSON.parse(JSON.stringify(originalItem));
    //     const item = newIDs(newItem);
    //     const newItemRow = createItem(item, sectionId, itemContainer);
        
    //     itemContainer.insertBefore(newItemRow, itemRow.nextSibling);
        
    //     jsonData.MenuSections[sectionIndex].MenuItems.splice(itemIndex+1, 0, item);
    //     jsonData.MenuSections[sectionIndex].MenuItems.forEach((obj, index) => {
    //         obj.DisplayOrder = index;
    //     });
    //     groupOptionSets()
    //     changeItemClockIcon(newItemRow, newItemRow.id);
    //     updateLocalStorage();
    // }

    const existingOsModal = document.querySelector('.osModalContainer')
    if (existingOsModal) {
        existingOsModal.remove()
    }

    const openOsModalContainer = newOsModalContainer(newOs)
    openOsModalContainer.style.display = 'block';
    setTimeout(() => {
        openOsModalContainer.classList.add('show');
    }, 10);
}



export { osDuplicateButton }
