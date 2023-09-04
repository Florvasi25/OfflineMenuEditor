// import {
//     sectionClockButton,
// } from './sectionClock.js'

import {
    itemVisibilityButton
} from './itemVisibility.js'

// import {
//     sectionDeleteButton
// } from './sectionDelete.js'

import {
    itemDuplicateButton,
} from './itemDuplicate.js'

import {
    createItemName
} from './itemName.js'

function createItemButtonsCell(itemRow, menuItem, sectionId, itemContainer) {
    const itemButtonsCell = document.createElement('td');
    itemButtonsCell.classList = "sectionButtonsCell"

    // const sectionName = createSectionName(sectionRow, menuSection)

    // sectionClockButton(itemButtonsCell)

    // sectionDeleteButton(itemButtonsCell, sectionRow, sectionName)

    itemVisibilityButton(itemRow, menuItem, itemButtonsCell, sectionId);

    itemDuplicateButton(itemRow, itemButtonsCell, sectionId, itemContainer, menuItem)

    return itemButtonsCell
}

export {
    createItemButtonsCell
}