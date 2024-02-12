import {
    addItemlessOs,
    getRandomInt,
    closeOsModalContainerQuick,
    removePublicIdFromOSItem
} from '../../context.js';

import { createOsModalContainer } from "../modalContainer.js";

function osDuplicateButton(osBtnsCell, menuOs) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    osBtnsCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)

    duplicateButton.addEventListener('click', () => {
        duplicateOs(menuOs);
    });

}

function duplicateOs(menuOs) {
    const newOs = JSON.parse(JSON.stringify(menuOs));
    const newOsId = getRandomInt();

    newOs.MenuItemOptionSetId = newOsId;
    newOs.groupOsId = null
    newOs.MenuItemId = null
    newOs.groupOsId = `group${getRandomInt()}`
    if(newOs.PublicId){ delete newOs.PublicId; }
    removePublicIdFromOSItem(newOs)
    newOs.Name += "_copy"

    // Set NextMenuItemOptionSetId to null for each option if it's not already null
    newOs.MenuItemOptionSetItems.forEach(option => {
        if (option.NextMenuItemOptionSetId !== null) {
            option.NextMenuItemOptionSetId = null;
        }
    });

    addItemlessOs(newOs)

    closeOsModalContainerQuick()

    const openOsModalContainer = createOsModalContainer(newOs)
    openOsModalContainer.style.display = 'block';
    setTimeout(() => {
        openOsModalContainer.classList.add('show');
    }, 10);
}

export { osDuplicateButton }