function createOsModalFooter(menuOs) {
    const osModalFooter = document.createElement('div');
    osModalFooter.className = 'osModalFooter';

    const searchItemOrSectionInput = searchItemOrSection();
    const searchResultsList = document.createElement('ul');
    searchResultsList.className = 'searchResults';
    osModalFooter.appendChild(searchItemOrSectionInput);
    osModalFooter.appendChild(searchResultsList);

    return osModalFooter;
}

function searchItemOrSection() {
    const searchItemOrSectionInput = document.createElement('input');
    searchItemOrSectionInput.type = 'text';
    searchItemOrSectionInput.placeholder = 'Search for OS...';
    searchItemOrSectionInput.id = 'searchItemOrSectionInput';

    // Add event listener for input
    searchItemOrSectionInput.addEventListener('input', function () {
        const searchText = searchItemOrSectionInput.value.toLowerCase();
        const itemNameCells = document.querySelectorAll('.itemNameCell');
        const searchResultsList = document.querySelector('.searchResults');
        searchResultsList.innerHTML = '';

        let visibleRowCounter = 0;

        itemNameCells.forEach(itemNameCell => {
            const itemName = itemNameCell.querySelector('.itemName').textContent.toLowerCase();
            
            if (itemName.includes(searchText)) {
                const listItem = document.createElement('li');
                listItem.textContent = itemNameCell.querySelector('.itemName').textContent;
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
    });

    return searchItemOrSectionInput;
}

export { createOsModalFooter };
