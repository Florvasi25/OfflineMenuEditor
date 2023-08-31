import {
    createItemContainer
} from './itemContainer.js';

function createSectionDropdown(sectionRow){
    const sectionDropdownCell = document.createElement('td')
    sectionDropdownCell.classList.add('sectionDropdownCell')

    const boxDropdownButton = createSectionDropdownButton(sectionRow)
    sectionDropdownCell.appendChild(boxDropdownButton)

    return sectionDropdownCell
}

function createSectionDropdownButton(sectionRow){
    const boxDropdownButton = document.createElement('div')
    boxDropdownButton.classList = 'boxDropdownButton'
    boxDropdownButton.innerHTML = `
    <div class="sectionDropdownButton"></div>`

    boxDropdownButton.addEventListener('click', event => {
        toggleSectionState(sectionRow);
        event.stopPropagation();
    });

    return boxDropdownButton
}

// Function to toggle section state and show/hide content
function toggleSectionState(sectionRow) {

    const expandedClassName = 'expanded';
    const foldedClassName = 'folded';

    if (sectionRow.classList.contains(expandedClassName)) {
        sectionRow.classList.remove(expandedClassName);
        sectionRow.classList.add(foldedClassName);

        const itemsContainer = sectionRow.nextElementSibling;
        if (itemsContainer && itemsContainer.classList.contains('itemsContainer')) {
            //itemsContainer.classList.add('itemContainer'); //??
            itemsContainer.remove(); // Remove the content container
        }
    } else {
        sectionRow.classList.remove(foldedClassName);
        sectionRow.classList.add(expandedClassName);

        let itemsContainer = sectionRow.nextElementSibling;
        if (!itemsContainer || !itemsContainer.classList.contains('itemsContainer')) {
            createItemContainer(itemsContainer, sectionRow);
        } else {
            itemsContainer.classList.remove('itemsContainer');
        }
    }
}

export {
    createSectionDropdown
}