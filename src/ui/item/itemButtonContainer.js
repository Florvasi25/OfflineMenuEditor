import { itemVisibilityButton } from './itemVisibility.js'

import { itemDeleteButton } from './itemDelete.js'

import { itemDuplicateButton } from './itemDuplicate.js'

import { itemClockButton } from '../clock/itemClock.js'

function createItemButtonsCell(itemRow, menuItem, sectionId, itemContainer) {
    const itemButtonsCell = document.createElement('div');
    itemButtonsCell.classList = "itemButtonsCell"
    
    itemClockButton(itemButtonsCell, itemRow.id, sectionId)
    itemVisibilityButton(itemRow, menuItem, itemButtonsCell, sectionId);
    itemDuplicateButton(itemRow, itemButtonsCell, sectionId, itemContainer, menuItem)
    itemDeleteButton(itemButtonsCell, itemRow, sectionId)
    
    return itemButtonsCell
}

export { createItemButtonsCell }