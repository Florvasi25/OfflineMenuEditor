import {
    createSectionDragCell,
} from './sectionDragAndDrop.js'

import {
    createSectionDropdown,
} from './sectionDropDown.js'

import {
    createSectionButtonsCell,
} from './sectionButtonContainer.js'

import {
    createSectionNameCell,
} from './sectionName.js'

import {
    createSectionDescCell,
} from './sectionDescription.js'

//Section components
function createSection(menuSection) {
    //Section Container
    const sectionRow = document.createElement('tr');
    sectionRow.classList.add('sectionContainer');
    sectionRow.classList.add('draggable');
    sectionRow.classList.add('folded')
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

    //OS Cell
    const sectionOsCell = document.createElement('td');
    sectionOsCell.classList.add('sectionOsCell');
    sectionRow.appendChild(sectionOsCell)

    //Price Cell
    const sectionPriceCell = document.createElement('td');
    sectionPriceCell.classList.add('sectionPriceCell');
    sectionRow.appendChild(sectionPriceCell)

    //Tax Cell
    const sectionTaxCell = document.createElement('td');
    sectionTaxCell.classList.add('sectionTaxCell');
    sectionRow.appendChild(sectionTaxCell)
    
    return sectionRow
}

export { 
    createSection, 
}