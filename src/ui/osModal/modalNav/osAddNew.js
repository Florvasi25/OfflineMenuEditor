import {
    jsonData,
    addItemlessOs,
    getRandomInt,
    closeOsModalContainerQuick
} from '../../context.js';

import { createOsModalContainer } from "../modalContainer.js";


function osNewButton(osBtnsCell) {
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
        const newOsId = getRandomInt();   

        const emptyOsJson = {
            CatalogItemId: null,
            MenuId: jsonData.MenuId,
            Name: "New Option Set " + getRandomInt(),
            MenuItemOptionSetId: newOsId,
            IsMasterOptionSet: false,
            DisplayOrder: 0,
            MinSelectCount: 0,
            MaxSelectCount: 1,
            IsDeleted: false,
            MenuItemOptionSetItems: [
                {
                    CatalogItemId: null,
                    MenuId: jsonData.MenuId,
                    MenuItemOptionSetItemId: null,
                    Name: "New Option " + getRandomInt(),
                    Price: 0,
                    TaxRateId: null,
                    TaxRate: null,
                    TaxValue: 0,
                    TaxRateName: null,
                    IsAvailable: true,
                    DisplayOrder: 0,
                    IsDeleted: false,
                    Tags: [],
                    NextMenuItemOptionSetId: null,
                    ImageName: null,
                    ImageUrl: null,
                    CellAspectRatio: 0,
                    CellLayoutType: 0,
                    OptionSetItemMetadata: [],
                    ExternalImageUrl: null,
                }
            ],
            ImageName: null,
            ImageUrl: null,
            CellAspectRatio: 0,
            CellLayoutType: 0,
            MinPrice: 0,
            MenuItemId: null,
            MenuItemOptionSetMetadata: [],
            ExternalImageUrl: null,
            groupOsId: `group${getRandomInt()}`
        };
        
        addItemlessOs(emptyOsJson)

        closeOsModalContainerQuick()

        const osModalContainer = createOsModalContainer(emptyOsJson)
        osModalContainer.style.display = 'block';
        setTimeout(() => {
            osModalContainer.classList.add('show');
        }, 10);
    });

    return newOsButton
}

export { osNewButton }
