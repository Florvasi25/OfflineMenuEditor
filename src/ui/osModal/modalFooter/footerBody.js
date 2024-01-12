import {
    jsonData
} from '../../context.js'

import {
    createAddButton
} from './footerAddItem.js'

import {
    createRemoveButton
} from './footerRemoveItem.js'

function createShowOsContainer(menuOs) {
    const showOs = document.createElement('div');
    showOs.className = 'showOs';

    const menuItemsWithMatchingGroupOs = [];

    const menuItemOptionSets = jsonData.MenuSections
        .flatMap(i => i.MenuItems)
        .flatMap(i => i.MenuItemOptionSets);

    menuItemOptionSets.forEach(os => {
        if (os.groupOsId === menuOs.groupOsId) {
            menuItemsWithMatchingGroupOs.push(os.MenuItemOptionSetId);
        }
    });

    const sectionsWithFilteredItems = {};

    jsonData.MenuSections.forEach(section => {
        const filteredItems = section.MenuItems.filter(item => {
            return item.MenuItemOptionSets.some(os => {
                return menuItemsWithMatchingGroupOs.includes(os.MenuItemOptionSetId);
            });
        });

        if (filteredItems.length > 0) {
            sectionsWithFilteredItems[section.Name] = {
                items: filteredItems,
                count: filteredItems.length,
                total: section.MenuItems.length
            };
        }
    });

    // Loop through sections and all items to create the structure
    jsonData.MenuSections.forEach(section => {
        const sectionName = section.Name;
        const allItems = section.MenuItems;

        const sectionHeader = document.createElement('p');
        sectionHeader.className = 'sectionHeader';

        if (section.MenuItems.length !== 0) {
            sectionHeader.innerHTML = `
            <p>${sectionName}</p> 
            <div class="filteredItemsCountContainer">(
                <p class="filteredItemsCount" id=${section.MenuSectionId}>${sectionsWithFilteredItems[sectionName]?.count || 0}</p>
                /
                <p>${section.MenuItems.length}</p>)
            </div>`;
            showOs.appendChild(sectionHeader);
        }

        const itemListContainer = document.createElement('ul');
        itemListContainer.className = 'itemListContainer';

        allItems.forEach(item => {
            const listedItem = document.createElement('li');
            listedItem.className = 'listedItem';
            listedItem.id = item.MenuItemId;

            const itemName = document.createElement('p')
            itemName.textContent = item.Name;

            listedItem.appendChild(itemName);

            // Highlight the listedItem if it belongs to the filtered section
            if (sectionsWithFilteredItems[sectionName] && sectionsWithFilteredItems[sectionName].items.includes(item)) {
                listedItem.style.backgroundColor = '#a2f5c0';
                const removeBtn = createRemoveButton(menuOs, item.MenuItemId)
                listedItem.appendChild(removeBtn)
            } else {
                const addBtn = createAddButton(menuOs, item.MenuItemId)
                listedItem.appendChild(addBtn);
            }

            itemListContainer.appendChild(listedItem);
        });

        showOs.appendChild(itemListContainer);
    });

    return showOs;
}

export { createShowOsContainer }