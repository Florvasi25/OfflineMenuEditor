import {
    createOsContainer
} from '../optionSet/osHeaderContainer.js'

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

        const osContainer = itemRow.nextElementSibling;
        if (osContainer && osContainer.classList.contains('osContainer')) {
            osContainer.classList.add('itemRow');
            osContainer.remove(); // Remove the content container
        }
    } else {
        itemRow.classList.remove(foldedClassName);
        itemRow.classList.add(expandedClassName);

        let osContainer = itemRow.nextElementSibling;
        if (!osContainer || !osContainer.classList.contains('osContainer')) {
            createOsContainer(itemRow, sectionId, itemRow.id);
        } else {
            osContainer.classList.remove('osContainer');
        }
    }
}

export {
    createItemDropdown,
}