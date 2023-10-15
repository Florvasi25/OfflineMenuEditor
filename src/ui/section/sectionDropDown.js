import { createItemContainer } from '../item/itemContainer.js';

function createSectionDropdown(sectionRow){
    const sectionDropdownCell = document.createElement('div')
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

        const itemTable = sectionRow.nextElementSibling;
        if (itemTable && itemTable.classList.contains('itemTable')) {
            itemTable.remove(); 
        }
    } else {
        sectionRow.classList.remove(foldedClassName);
        sectionRow.classList.add(expandedClassName);

        let itemTable = sectionRow.nextElementSibling;
        if (!itemTable || !itemTable.classList.contains('itemTable')) {
            createItemContainer(sectionRow);
        } else {
            itemTable.classList.remove('itemTable');
        }
    }
}

export { createSectionDropdown }