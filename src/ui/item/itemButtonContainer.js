import { itemVisibilityButton } from './itemVisibility.js'

import { itemDeleteButton } from './itemDelete.js'

import { itemDuplicateButton } from './itemDuplicate.js'

import { itemClockButton } from '../clock/itemClock.js'

import { itemAlcoholButton } from './itemAlcohol.js'

import { itemDiscountButton } from './itemDiscount.js'

import { itemLockButton } from './itemLock.js'

function createItemButtonsCell(itemRow, menuItem, sectionId, itemContainer) {
    const itemButtonsCell = document.createElement('div');
    itemButtonsCell.classList = "itemButtonsCell"

    const leftItemContainer = document.createElement('div');

    itemClockButton(leftItemContainer, itemRow.id, sectionId)
    itemAlcoholButton(itemRow, menuItem, leftItemContainer, sectionId)
    itemDiscountButton(leftItemContainer, itemRow.id, sectionId)
    itemLockButton(leftItemContainer, itemRow.id, sectionId)

    const rightItemContainer = document.createElement('div')
    
    itemDeleteButton(rightItemContainer, itemRow, sectionId)
    itemVisibilityButton(itemRow, menuItem, rightItemContainer, sectionId);
    itemDuplicateButton(itemRow, rightItemContainer, sectionId, itemContainer, menuItem)

    itemButtonsCell.appendChild(leftItemContainer)
    itemButtonsCell.appendChild(rightItemContainer)
    
    return itemButtonsCell
}

export { createItemButtonsCell }