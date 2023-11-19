import { createOptionsContainer } from './osOptionsContainer.js'

function createOsDropdown(osRowHeader, menuOs, sectionId, itemId){
    const osDropdownCell = document.createElement('div')
    osDropdownCell.classList.add('osDropdownCell')

    const boxDropdownButton = createOsDropdownButton(osRowHeader, menuOs, sectionId, itemId)
    osDropdownCell.appendChild(boxDropdownButton)

    return osDropdownCell
}

function createOsDropdownButton(osRowHeader, menuOs, sectionId, itemId){
    const boxDropdownButton = document.createElement('div')
    boxDropdownButton.classList = 'boxDropdownButton'
    boxDropdownButton.innerHTML = `
    <div class="osDropdownButton"></div>`

    boxDropdownButton.addEventListener('click', event => {
        toggleItemState(osRowHeader, menuOs, sectionId, itemId);
        event.stopPropagation();
    });

    return boxDropdownButton
}

function toggleItemState(osRowHeader, menuOs, sectionId, itemId) {
    const expandedClassName = 'expanded';
    const foldedClassName = 'folded';

    if (osRowHeader.classList.contains(expandedClassName)) {
        osRowHeader.classList.remove(expandedClassName);
        osRowHeader.classList.add(foldedClassName);

        const optionContainer = osRowHeader.nextElementSibling;
        if (optionContainer && optionContainer.classList.contains('optionContainer')) {
            optionContainer.remove(); // Remove the content container
        }
    } else {
        osRowHeader.classList.remove(foldedClassName);
        osRowHeader.classList.add(expandedClassName);

        const optionContainer = osRowHeader.nextElementSibling;
        if (!optionContainer || !optionContainer.classList.contains('optionContainer')) {
            createOptionsContainer(osRowHeader, sectionId, itemId, osRowHeader.id)
        }
    }
}

export { createOsDropdown }