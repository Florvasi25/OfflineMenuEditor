import {
    itemClockButton,
} from './itemClock.js'

import {
    itemVisibilityButton
} from '../itemVisibility.js'

import {
    itemDeleteButton
} from './itemDelete.js'

import {
    itemDuplicateButton,
} from '../itemDuplicate.js'

function createItemButtonsCell(itemRow, menuItem, sectionId, itemContainer) {
    const itemButtonsCell = document.createElement('td');
    itemButtonsCell.classList = "sectionButtonsCell"

    itemClockButton(itemButtonsCell)
    
    itemDeleteButton(itemButtonsCell, itemRow, sectionId)

    itemVisibilityButton(itemRow, menuItem, itemButtonsCell, sectionId);

    itemDuplicateButton(itemRow, itemButtonsCell, sectionId, itemContainer, menuItem)

    return itemButtonsCell
}

export {
    createItemButtonsCell
}