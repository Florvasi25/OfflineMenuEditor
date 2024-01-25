import { createOptionsContainer } from './osOptionsContainer.js'

import { addWarningMoM } from '../context.js'
import { removeToolTip } from '../toolTip.js'


function createOsDropdown(osRowHeader, sectionId, itemId){
    const osDropdownCell = document.createElement('div')
    osDropdownCell.classList.add('osDropdownCell')

    const boxDropdownButton = createOsDropdownButton(osRowHeader, sectionId, itemId)
    osDropdownCell.appendChild(boxDropdownButton)

    return osDropdownCell
}

function createOsDropdownButton(osRowHeader, sectionId, itemId){
    const boxDropdownButton = document.createElement('div')
    boxDropdownButton.classList = 'boxDropdownButton'
    boxDropdownButton.innerHTML = `
    <div class="osDropdownButton"></div>`

    boxDropdownButton.addEventListener('click', event => {
        toggleOsState(osRowHeader, sectionId, itemId);
        event.stopPropagation();
    });

    return boxDropdownButton
}

function toggleOsState(osRowHeader, sectionId, itemId) {
    const expandedClassName = 'expanded';
    const foldedClassName = 'folded';

    if (osRowHeader.classList.contains(expandedClassName)) {
        osRowHeader.classList.remove(expandedClassName);
        osRowHeader.classList.add(foldedClassName);

        const optionContainer = osRowHeader.nextElementSibling;
        if (optionContainer && optionContainer.classList.contains('optionContainer')) {
            optionContainer.remove(); // Remove the content container
            removeToolTip()
        }
    } else {
        osRowHeader.classList.remove(foldedClassName);
        osRowHeader.classList.add(expandedClassName);

        const optionContainer = osRowHeader.nextElementSibling;
        if (!optionContainer || !optionContainer.classList.contains('optionContainer')) {
            createOptionsContainer(osRowHeader, sectionId, itemId, osRowHeader.id)
            addWarningMoM()
        }
    }
}

export { 
    createOsDropdown,
    toggleOsState
}