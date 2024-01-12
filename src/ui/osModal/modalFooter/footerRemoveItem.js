import {
    jsonData,
    updateLocalStorage,
    groupedOs,
    addItemlessOs
} from "../../context.js";

import {
    createAddButton
} from './footerAddItem.js'

function createRemoveButton(menuOs, menuItemId) {
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'deleteBtn'
    deleteBtn.textContent = '-'

    const foundItem = jsonData.MenuSections
    .flatMap(i => i.MenuItems)
    .find(i => i.MenuItemId == menuItemId);
    
    deleteBtn.addEventListener('click', (event) => {
        const correctOs = Array.from(foundItem.MenuItemOptionSets).find(i => i.groupOsId == menuOs.groupOsId);

        const targetParent = event.target.parentElement;
        targetParent.style.backgroundColor = '#ffffff';
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
            addItemlessOs(menuOs);
        } else if (groupedOs[correctOs.groupOsId]) {
            console.log(groupedOs[correctOs.groupOsId].indexOf(correctOs));
            groupedOs[correctOs.groupOsId].splice(groupedOs[correctOs.groupOsId].indexOf(correctOs), 1)
        }
        
        updateLocalStorage()
    })
    
    return deleteBtn
}

export { createRemoveButton };