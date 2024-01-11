import {
    jsonData,
    deleteItemlessOs,
    getLocalStorageOptionSetIDs,
    getUniqueRandomInt,
    getLocalStorageOptionSetItemsIDs,
    groupOptionSets,
    updateLocalStorage,
    groupedOs,
    addItemlessOs
} from "../../context.js";

import {
    createOsRow
} from '../../optionSet/osHeaderContainer.js'

function createOsModalFooter(menuOs) {
    const osModalFooter = document.createElement('div');
    osModalFooter.className = 'osModalFooter';

    const searchItemOrSectionInput = searchItemOrSection(osModalFooter);
    const searchResultsList = document.createElement('ul');
    searchResultsList.className = 'searchResults';
    osModalFooter.appendChild(searchItemOrSectionInput);
    osModalFooter.appendChild(searchResultsList);

    const showOs = createShowOs(menuOs);
    osModalFooter.appendChild(showOs);

    return osModalFooter;
}

function searchItemOrSection(osModalFooter) {
    const searchItemOrSectionInput = document.createElement('input');
    searchItemOrSectionInput.type = 'text';
    searchItemOrSectionInput.placeholder = 'Search for Items or Sections';
    searchItemOrSectionInput.id = 'searchOsInput';

    // Add event listener for input
    searchItemOrSectionInput.addEventListener('input', function () {
        const searchText = searchItemOrSectionInput.value.toLowerCase();
        const showOs = osModalFooter.querySelector('.showOs');
        const sections = showOs.querySelectorAll('.sectionHeader');
        const itemList = showOs.querySelectorAll('.itemList');

        sections.forEach(section => {
            const sectionName = section.textContent.toLowerCase();
            const itemsList = section.nextElementSibling;

            // Check if section name matches the search text
            const sectionMatches = sectionName.includes(searchText);

            // Show/hide section based on the match
            section.style.display = sectionMatches || searchText === '' ? 'flex' : 'none';

            // If the section matches or no search text, show all its items
            if (sectionMatches || searchText === '') {
                itemsList.style.display = 'flex';
                const items = itemsList.querySelectorAll('.listedItem');
                items.forEach(item => {
                    item.style.display = 'flex';
                });
                return;
            }

            // Otherwise, filter the items within the section
            const items = itemsList.querySelectorAll('.listedItem');
            let hasMatchingItem = false;

            items.forEach(item => {
                const itemName = item.textContent.toLowerCase();
                const itemMatches = itemName.includes(searchText);
                item.style.display = itemMatches ? 'flex' : 'none';
                if (itemMatches) {
                    hasMatchingItem = true;
                    section.style.display = 'flex'; // Show the section header
                }
            });

            // Show/hide items list based on item match
            itemsList.style.display = hasMatchingItem ? 'flex' : 'none';
        });
    });

    return searchItemOrSectionInput;
}

function createShowOs(menuOs) {
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
            sectionHeader.textContent = `${sectionName} (${sectionsWithFilteredItems[sectionName]?.count || 0}/${section.MenuItems.length})`;
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
                listedItem.style.backgroundColor = '#8ef274';
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

function createAddButton(menuOs, menuItemId) {
    const addBtn = document.createElement('button');
    addBtn.className = 'addBtn';
    addBtn.textContent = '+';

    const foundItem = jsonData.MenuSections
        .flatMap(i => i.MenuItems)
        .find(i => i.MenuItemId == menuItemId);

    addBtn.addEventListener('click', (event) => {
        const targetParent = event.target.parentElement;
        targetParent.style.backgroundColor = '#8ef274';
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

        const removeBtn = createRemoveButton(menuOs, menuItemId);
        targetParent.appendChild(removeBtn);

        if (!groupedOs[menuOs.groupOsId]) {
            groupedOs[menuOs.groupOsId] = [newOs];
        } else {
            groupedOs[menuOs.groupOsId].push(newOs)
        }

        updateLocalStorage()
    })

    return addBtn
}

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

        console.log(correctOs);
        console.log(groupedOs[correctOs.groupOsId]);
        console.log(groupedOs[correctOs.groupOsId].indexOf(menuOs));

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

        const addBtn = createAddButton(menuOs, menuItemId);
        targetParent.appendChild(addBtn);
        
        if (groupedOs[menuOs.groupOsId] && groupedOs[menuOs.groupOsId].length === 1) {
            delete groupedOs[menuOs.groupOsId];
            addItemlessOs(menuOs);
        } else if (groupedOs[menuOs.groupOsId]) {
            groupedOs[menuOs.groupOsId].splice(groupedOs[menuOs.groupOsId].indexOf(menuOs), 1)
        }
        
        updateLocalStorage()
    })
    
    console.log(groupedOs);
    return deleteBtn
}

export { createOsModalFooter };