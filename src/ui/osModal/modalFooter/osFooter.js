import { jsonData } from "../../context.js";

function createOsModalFooter(menuOs) {
    const osModalFooter = document.createElement('div');
    osModalFooter.className = 'osModalFooter';

    const searchItemOrSectionInput = searchItemOrSection(menuOs);
    const searchResultsList = document.createElement('ul');
    searchResultsList.className = 'searchResults';
    osModalFooter.appendChild(searchItemOrSectionInput);
    osModalFooter.appendChild(searchResultsList);

    return osModalFooter;
}

function searchItemOrSection(menuOs) {
    const searchItemOrSectionInput = document.createElement('input');
    searchItemOrSectionInput.type = 'text';
    searchItemOrSectionInput.placeholder = 'Search for Item or Section';
    searchItemOrSectionInput.id = 'searchItemOrSectionInput';

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
                        const listItem = document.createElement('li');
                        listItem.textContent = item.Name;

                        const addButton = document.createElement('button');
                        addButton.textContent = '+';
                        addButton.classList.add('add-button');
                        addButton.addEventListener('click', function() {
                            console.log('Button clicked for item:', item.Name);
                        });

                        listItem.appendChild(addButton);
                        listItem.classList.add('menu-item-background');
                        searchResultsList.appendChild(listItem);
                        visibleRowCounter++;
                    }
                });
            });

            // Search in MenuSections Name
            jsonData.MenuSections.forEach(section => {
                const sectionName = section.Name.toLowerCase();
                if (sectionName.includes(searchText)) {
                    const listItem = document.createElement('li');
                    listItem.textContent = section.Name;

                    const addButton = document.createElement('button');
                    addButton.textContent = '+';
                    addButton.classList.add('add-button');
                    addButton.addEventListener('click', function() {
                        console.log('Button clicked for section:', section.Name);
                    });

                    listItem.appendChild(addButton);
                    listItem.classList.add('menu-section-background');
                    searchResultsList.appendChild(listItem);
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

export { createOsModalFooter };