import { jsonData } from "../../context.js";

function createOsModalFooter(menuOs) {
    const osModalFooter = document.createElement('div');
    osModalFooter.className = 'osModalFooter';

    const searchItemOrSectionInput = searchItemOrSection(menuOs, osModalFooter);
    const searchResultsList = document.createElement('ul');
    searchResultsList.className = 'searchResults';
    osModalFooter.appendChild(searchItemOrSectionInput);
    osModalFooter.appendChild(searchResultsList);

    const showOs = createShowOs(menuOs);
    osModalFooter.appendChild(showOs);

    return osModalFooter;
}

function searchItemOrSection(menuOs, osModalFooter) {
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

    // Loop through sections and filtered items to create the structure
    for (const [sectionName, { items, count, total }] of Object.entries(sectionsWithFilteredItems)) {
        const sectionHeader = document.createElement('p');
        sectionHeader.className = 'sectionHeader';
        sectionHeader.textContent = `${sectionName} (${count}/${total})`;
        showOs.appendChild(sectionHeader);

        const itemList = document.createElement('ul');
        itemList.className = 'itemList';
        items.forEach(item => {
            const listedItem = document.createElement('li');
            listedItem.className = 'listedItem'
            listedItem.textContent = item.Name;
            itemList.appendChild(listedItem);
        });
        showOs.appendChild(itemList);
    }

    return showOs;
}

export { createOsModalFooter };