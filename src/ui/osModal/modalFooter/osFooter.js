import {
    searchItemOrSection
} from './footerSearchBar.js'

import {
    createShowOsContainer
} from './footerBody.js'

function createOsModalFooter(menuOs) {
    const osModalFooter = document.createElement('div');
    osModalFooter.className = 'osModalFooter';

    const searchItemOrSectionInput = searchItemOrSection(osModalFooter);
    const searchResultsList = document.createElement('ul');
    searchResultsList.className = 'searchResults';
    osModalFooter.appendChild(searchItemOrSectionInput);
    osModalFooter.appendChild(searchResultsList);

    const showOsContainer = createShowOsContainer(menuOs);
    osModalFooter.appendChild(showOsContainer);

    return osModalFooter;
}

export { createOsModalFooter };