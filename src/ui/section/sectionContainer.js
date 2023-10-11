import { createSectionDragCell } from './sectionDragAndDrop.js'

import { createSectionDropdown } from './sectionDropDown.js'

import { createSectionButtonsCell } from './sectionButtonContainer.js'

import { createSectionNameCell } from './sectionName.js'

import { createSectionDescCell } from './sectionDescription.js'

//Section components
function createSection(menuSection) {
    //Section Container
    const sectionRow = document.createElement('div');
    sectionRow.classList.add('sectionRow');
    sectionRow.classList.add('draggable');
    sectionRow.classList.add('folded')
    sectionRow.setAttribute('colspan', 5)
    sectionRow.id = menuSection.MenuSectionId;

    //Creates Dropdown Cell
    const sectionDropdownCell = createSectionDropdown(sectionRow)
    sectionRow.appendChild(sectionDropdownCell)

    //Creates Drag Cell
    const sectionDragCell = createSectionDragCell(sectionRow)
    sectionRow.appendChild(sectionDragCell)

    //Creates Buttons Cell
    const sectionButtonsCell = createSectionButtonsCell(sectionRow, menuSection)
    sectionRow.appendChild(sectionButtonsCell)

    //Creates Section Name Cell
    const sectionNameCell = createSectionNameCell(sectionRow, menuSection)
    sectionRow.appendChild(sectionNameCell)

    //Section Desc Cell
    const sectionDescCell = createSectionDescCell(menuSection, sectionRow);
    sectionRow.appendChild(sectionDescCell)
    
    return sectionRow
}

export { createSection }