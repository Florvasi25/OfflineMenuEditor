import {
    itemClockButton,
} from './itemClock.js'

import {
    itemVisibilityButton
} from './itemVisibility.js'

import {
    itemDeleteButton
} from './itemDelete.js'

import {
    itemDuplicateButton,
} from './itemDuplicate.js'

import {
    createItemName
} from './itemName.js'

function createItemButtonsCell(itemRow, menuItem, sectionId, itemContainer) {
    const itemButtonsCell = document.createElement('td');
    itemButtonsCell.classList = "sectionButtonsCell"

    const itemName = createItemName(itemRow, menuItem, sectionId)

    itemClockButton(itemButtonsCell)
    
    itemDeleteButton(itemButtonsCell, itemRow, itemName, sectionId)

    itemVisibilityButton(itemRow, menuItem, itemButtonsCell, sectionId);

    itemDuplicateButton(itemRow, itemButtonsCell, sectionId, itemContainer, menuItem)

    return itemButtonsCell
}

export {
    createItemButtonsCell
}