/*import {
    itemClockButton,
} from './itemClock.js'*/

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
    itemClockButton,
} from '../clock/itemClock.js'

function createItemButtonsCell(itemRow, menuItem, sectionId, itemContainer) {
    const itemButtonsCell = document.createElement('div');
    itemButtonsCell.classList = "sectionButtonsCell"

    itemClockButton(itemButtonsCell, itemRow.id)
    
    itemDeleteButton(itemButtonsCell, itemRow, sectionId)

    itemVisibilityButton(itemRow, menuItem, itemButtonsCell, sectionId);

    itemDuplicateButton(itemRow, itemButtonsCell, sectionId, itemContainer, menuItem)

    return itemButtonsCell
}

export {
    createItemButtonsCell
}