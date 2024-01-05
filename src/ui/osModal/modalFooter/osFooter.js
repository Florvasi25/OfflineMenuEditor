import { jsonData } from "../../context.js";

function createOsModalFooter(menuOs) {
    const osModalFooter = document.createElement('div');
    osModalFooter.className = 'osModalFooter';

    const searchItemOrSectionInput = searchItemOrSection(menuOs);
    const searchResultsList = document.createElement('ul');
    searchResultsList.className = 'searchResults';
    osModalFooter.appendChild(searchItemOrSectionInput);
    osModalFooter.appendChild(searchResultsList);

    const showOs = createShowOs(menuOs);
    osModalFooter.appendChild(showOs);

    return osModalFooter;
}

function searchItemOrSection(menuOs) {
    const searchItemOrSectionInput = document.createElement('input');
    searchItemOrSectionInput.type = 'text';
    searchItemOrSectionInput.placeholder = 'Search for Items or Sections';
    searchItemOrSectionInput.id = 'searchOsInput';

    // Add event listener for input
    searchItemOrSectionInput.addEventListener('input', function () {
        const searchText = searchItemOrSectionInput.value.toLowerCase();
        const searchResultsList = document.querySelector('.searchResults');
        searchResultsList.innerHTML = '';

        let visibleRowCounter = 0;

        if (searchText.trim() !== '') { 
            // Search in MenuItems
            jsonData.MenuSections.forEach(section => {
                section.MenuItems.forEach(item => {
                    const itemName = item.Name.toLowerCase();
                    
                    if (itemName.includes(searchText)) {
                        const listedItem = document.createElement('li');
                        listedItem.textContent = item.Name;

                        const addButton = document.createElement('button');
                        addButton.textContent = '+';
                        addButton.classList.add('add-button');
                        addButton.addEventListener('click', function() {
                            console.log('Button clicked for item:', item.Name);
                        });

                        listedItem.appendChild(addButton);
                        listedItem.classList.add('menu-item-background');
                        searchResultsList.appendChild(listedItem);
                        visibleRowCounter++;
                    }
                });
            });

            // Search in MenuSections Name
            jsonData.MenuSections.forEach(section => {
                const sectionName = section.Name.toLowerCase();
                if (sectionName.includes(searchText)) {
                    const listedItem = document.createElement('li');
                    listedItem.textContent = section.Name;

                    const addButton = document.createElement('button');
                    addButton.textContent = '+';
                    addButton.classList.add('add-button');
                    addButton.addEventListener('click', function() {
                        console.log('Button clicked for section:', section.Name);
                    });

                    listedItem.appendChild(addButton);
                    listedItem.classList.add('menu-section-background');
                    searchResultsList.appendChild(listedItem);
                    visibleRowCounter++;
                }
            });

            // Show/hide the search results list
            if (visibleRowCounter > 0) {
                searchResultsList.style.display = 'block';
            } else {
                searchResultsList.style.display = 'none';
            }
        } else {
            searchResultsList.style.display = 'none';
        }
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