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
    searchItemOrSectionInput.placeholder = 'Search for OS...';
    searchItemOrSectionInput.id = 'searchItemOrSectionInput';

    // Add event listener for input
    searchItemOrSectionInput.addEventListener('input', function () {
        const searchText = searchItemOrSectionInput.value.toLowerCase();
        const searchResultsList = document.querySelector('.searchResults');
        searchResultsList.innerHTML = '';

        let visibleRowCounter = 0;

        if (searchText.trim() !== '') { // Check if search text is not empty
            jsonData.MenuSections.forEach(section => {
                section.MenuItems.forEach(item => {
                    const itemName = item.Name.toLowerCase();
                    
                    if (itemName.includes(searchText)) {
                        const listItem = document.createElement('li');
                        listItem.textContent = item.Name;
                        searchResultsList.appendChild(listItem);
                        visibleRowCounter++;
                    }
                });
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
