import {
    jsonData,
    updateLocalStorage,
    groupedOs,
    addItemlessOs,
    closeOsModalContainerQuick,
    addWarningMoM
} from "../../context.js";

import {
    createAddButton
} from './footerAddItem.js'

import {
    createOsModalContainer
} from '../../osModal/modalContainer.js'

import { slotManagerInstance } from  "../../mainContainer.js";

function createRemoveButton(menuOs, menuItemId) {
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'deleteBtn'
    deleteBtn.textContent = '-'

    const foundItem = jsonData.MenuSections
    .flatMap(i => i.MenuItems)
    .find(i => i.MenuItemId == menuItemId);

    deleteBtn.addEventListener('click', (event) => {
        const masterOptionSetExists = foundItem.MenuItemOptionSets.some(optionSet => optionSet.IsMasterOptionSet === true);
        if (masterOptionSetExists) {
            const itemRow = document.getElementById(foundItem.MenuItemId);
            if (itemRow) {
                const itemPriceCell = itemRow.querySelector('.itemPriceCell');
                if (itemPriceCell) {
                    itemPriceCell.style.display = 'flex';
                }
            }
        }
        
        const correctOs = Array.from(foundItem.MenuItemOptionSets).find(i => i.groupOsId == menuOs.groupOsId);

        const targetParent = event.target.parentElement;

        if (foundItem.IsAvailable == false) {
            targetParent.style.backgroundColor = '#00000041';
        } else {
            targetParent.style.backgroundColor = '#ffffff';
        }

        deleteBtn.style.display = 'none';

        foundItem.MenuItemOptionSets.splice(foundItem.MenuItemOptionSets.indexOf(correctOs), 1)
    
        const osRowHeaderPreviewArray = Array.from(document.getElementsByClassName('osRowHeader'));
        const osRowOptionPreview = osRowHeaderPreviewArray.find((p) => p.id == correctOs.MenuItemOptionSetId);

        if (osRowOptionPreview) {
            if (osRowOptionPreview.classList.contains('expanded')) {
                let option = osRowOptionPreview.nextElementSibling;
                if (option.tagName === 'DIV' && option.classList.contains('optionContainer')) {
                    option.remove();
                }
            }
            osRowOptionPreview.remove();
        }

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

        const filteredItemsCountArray = Array.from(document.getElementsByClassName('filteredItemsCount'));
        const filteredItemsCount = filteredItemsCountArray.find((p) => p.id == foundItem.MenuSectionId);
        
        if (filteredItemsCount) {
            const currentCount = parseInt(filteredItemsCount.textContent) || 0;
            filteredItemsCount.textContent = currentCount - 1;
        }

        const addBtn = createAddButton(menuOs, menuItemId);
        targetParent.appendChild(addBtn);
        
        if (groupedOs[menuOs.groupOsId] && groupedOs[menuOs.groupOsId].length === 1) {
            delete groupedOs[menuOs.groupOsId];
            menuOs.MenuItemId = null
            addItemlessOs(menuOs);
            const optionMoMArray = Array.from(document.getElementsByClassName('optionMoM'))
            optionMoMArray.forEach((optionMoM) => {
                if (optionMoM.textContent !== "Empty") {
                    optionMoM.textContent = 'Empty';
                    optionMoM.style = 'color: #a3a3a3;'
                }
            })
        } else if (groupedOs[correctOs.groupOsId]) {
            groupedOs[correctOs.groupOsId].splice(groupedOs[correctOs.groupOsId].indexOf(correctOs), 1)

            if (correctOs == menuOs) {
                const nextMenuOs = groupedOs[menuOs.groupOsId][0];

                const nextFoundItem = jsonData.MenuSections
                .flatMap(i => i.MenuItems)
                .find(i => i.MenuItemId == nextMenuOs.MenuItemId);

                closeOsModalContainerQuick()

                const osModalContainer = createOsModalContainer(nextMenuOs, nextFoundItem.MenuSectionId, nextMenuOs.MenuItemId)
                osModalContainer.style.display = 'block';
                osModalContainer.classList.add('show');
            }
        }
        
        updateLocalStorage(slotManagerInstance.currentSlot);
        addWarningMoM();
    })
    
    return deleteBtn
}

export { createRemoveButton };