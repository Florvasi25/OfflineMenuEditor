import {
    jsonData,
    deleteItemlessOs,
    getLocalStorageOptionSetIDs,
    getUniqueRandomInt,
    getLocalStorageOptionSetItemsIDs,
    updateLocalStorage,
    groupedOs,
    getRandomInt,
} from "../../context.js";

import {
    createOsRow
} from '../../optionSet/osHeaderContainer.js'

import {
    createRemoveButton
} from './footerRemoveItem.js'

function createAddButton(menuOs, menuItemId) {
    const addBtn = document.createElement('button');
    addBtn.className = 'addBtn';
    addBtn.textContent = '+';

    const foundItem = jsonData.MenuSections
        .flatMap(i => i.MenuItems)
        .find(i => i.MenuItemId == menuItemId);

    addBtn.addEventListener('click', (event) => {
        const targetParent = event.target.parentElement;
        targetParent.style.backgroundColor = '#a2f5c0';
        addBtn.style.display = 'none';

        const newOs = JSON.parse(JSON.stringify(menuOs));

        deleteItemlessOs(newOs)

        newOs.MenuItemId = foundItem.MenuItemId

        const optionSetsIds = getLocalStorageOptionSetIDs();
        const newOptionSetId = getUniqueRandomInt(optionSetsIds);
        newOs.MenuItemOptionSetId = newOptionSetId;

        newOs.MenuItemOptionSetItems.forEach(option => {
            const optionIds = getLocalStorageOptionSetItemsIDs();
            const newOptionId = getUniqueRandomInt(optionIds);
            option.MenuItemOptionSetItemId = newOptionId
        })

        newOs.DisplayOrder = foundItem.MenuItemOptionSets.length

        foundItem.MenuItemOptionSets.push(newOs)

        const osContainerPreviewArray = Array.from(document.getElementsByClassName('osContainer'));
        const osContainerPreview = osContainerPreviewArray.find((p) => p.id == foundItem.MenuItemId);

        const newOptionRow = createOsRow(newOs, foundItem.MenuSectionId, foundItem.MenuItemId)
        if (osContainerPreview) {
            osContainerPreview.appendChild(newOptionRow);
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
            filteredItemsCount.textContent = currentCount + 1;
        }

        const removeBtn = createRemoveButton(menuOs, menuItemId);
        targetParent.appendChild(removeBtn);

        if (!groupedOs[menuOs.groupOsId]) {
            console.log('removed from itemless');
            groupedOs[menuOs.groupOsId] = [newOs];
        } else {
            console.log('added to the group');
            groupedOs[menuOs.groupOsId].push(newOs)
        }

        updateLocalStorage()
        console.log("groupedOs", groupedOs);
    })
    

    return addBtn
}

export { createAddButton }