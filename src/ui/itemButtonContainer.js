// import {
//     sectionClockButton,
// } from './sectionClock.js'

import {
    itemVisibilityButton
} from './itemVisibility.js'

// import {
//     sectionDeleteButton
// } from './sectionDelete.js'

// import {
//     sectionDuplicateButton,
// } from './sectionDuplicate.js'

import {
    createItemName
} from './itemName.js'

function createItemButtonsCell(itemRow, menuItem, sectionId) {
    const itemButtonsCell = document.createElement('td');
    itemButtonsCell.classList = "sectionButtonsCell"

    // const sectionName = createSectionName(sectionRow, menuSection)

    // sectionClockButton(itemButtonsCell)

    // sectionDeleteButton(itemButtonsCell, sectionRow, sectionName)

    itemVisibilityButton(itemRow, menuItem, itemButtonsCell, sectionId);

    // sectionDuplicateButton(sectionRow, itemButtonsCell, menuSection)


    return itemButtonsCell
}

export {
    createItemButtonsCell
}