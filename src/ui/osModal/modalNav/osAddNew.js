import {
    jsonData,
    getLocalStorageOptionSetIDs,
    getRandomInt,
    addItemlessOs,
    getUniqueRandomInt
} from '../../context.js';

import { createOsModalContainer } from "../modalContainer.js";


function osNewButton(osBtnsCell, menuOs) {
    const newOsButton = document.createElement('button');
    newOsButton.classList.add('sectionButton')
    newOsButton.classList.add('newOsButton')
    osBtnsCell.appendChild(newOsButton);
    const newOsButtonImg = document.createElement('img')
    newOsButtonImg.classList.add('sectionButtonImg')
    newOsButtonImg.src = '../../assets/plusIcon.svg'
    newOsButton.appendChild(newOsButtonImg)

    //Add Section
    newOsButton.addEventListener('click', () => {
        const osIds = getLocalStorageOptionSetIDs();
        const newOsId = getUniqueRandomInt(osIds);   

        const emptyOsJson = {
            CatalogItemId: null,
            MenuId: jsonData.MenuId,
            Name: "New Option Set " + getRandomInt(),
            MenuItemOptionSetId: newOsId,
            IsMasterOptionSet: false,
            DisplayOrder: 0,
            MinSelectCount: 0,
            MaxSelectCount: 0,
            IsDeleted: false,
            PublicId: crypto.randomUUID(),
            MenuItemOptionSetItems: [],
            ImageName: null,
            ImageUrl: null,
            CellAspectRatio: 0,
            CellLayoutType: 0,
            MinPrice: 0,
            MenuItemId: null,
            MenuItemOptionSetMetadata: [],
            ExternalImageUrl: null
        };

        const existingOsModal = document.querySelector('.osModalContainer')
        if (existingOsModal) {
            existingOsModal.remove()
        }
        const osModalContainer = createOsModalContainer(emptyOsJson)
        osModalContainer.style.display = 'block';
        setTimeout(() => {
            osModalContainer.classList.add('show');
        }, 10);

        addItemlessOs(emptyOsJson)
    });

    return newOsButton
}

export { osNewButton }
