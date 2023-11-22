import { createOsContainer } from '../optionSet/osHeaderContainer.js'

function createItemDropdown(itemRow, sectionId){
    const itemDropdownCell = document.createElement('div')
    itemDropdownCell.classList.add('itemDropdownCell')

    const boxDropdownButton = createItemDropdownButton(itemRow, sectionId)
    itemDropdownCell.appendChild(boxDropdownButton)

    return itemDropdownCell
}

function createItemDropdownButton(itemRow, sectionId){
    const boxDropdownButton = document.createElement('div')
    boxDropdownButton.classList = 'boxDropdownButton'
    boxDropdownButton.innerHTML = `
    <div class="sectionDropdownButton"></div>`

    boxDropdownButton.addEventListener('click', event => {
        toggleItemState(itemRow, sectionId);
        event.stopPropagation();
    });

    return boxDropdownButton
}

function toggleItemState(itemRow, sectionId) {
    const expandedClassName = 'expanded';
    const foldedClassName = 'folded';

    if (itemRow.classList.contains(expandedClassName)) {
        itemRow.classList.remove(expandedClassName);
        itemRow.classList.add(foldedClassName);

        const osTable = itemRow.nextElementSibling;
        if (osTable && osTable.classList.contains('osTable')) {
            osTable.classList.add('itemRow');
            osTable.remove(); // Remove the content container
        }
    } else {
        itemRow.classList.remove(foldedClassName);
        itemRow.classList.add(expandedClassName);

        let osTable = itemRow.nextElementSibling;
        if (!osTable || !osTable.classList.contains('osTable')) {
            createOsContainer(itemRow, sectionId, itemRow.id);
        } else {
            osTable.classList.remove('osTable');
        }
    }
}

export { 
    createItemDropdown,
    toggleItemState
}