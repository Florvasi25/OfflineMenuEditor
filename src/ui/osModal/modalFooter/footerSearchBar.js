function searchItemOrSection(osModalFooter) {
    const searchItemOrSectionContainer = document.createElement('div');
    searchItemOrSectionContainer.className = 'searchItemOrSectionContainer';

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

    searchItemOrSectionContainer.appendChild(searchItemOrSectionInput);

    return searchItemOrSectionContainer;
}

export { searchItemOrSection }