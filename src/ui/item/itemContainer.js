import { 
    jsonData,
    getSectionIndex, 
} from '../context.js'

import {
    createItemNameCell
} from './itemName.js'

import {
    createItemDropdown
} from './itemDropDown.js'

import {
    createItemDragCell,
    setDragListeners,
} from './itemDragAndDrop.js'

import {
    createItemButtonsCell
} from './itemButtonContainer.js'

import {
    createItemButton
} from './itemAddNew.js'

import {
    createItemDescCell
} from './itemDescription.js'

import {
    createItemPriceCell,
} from './itemPrice.js'

import {
    createItemTaxCell
} from './itemTax.js'

function createItemContainer(sectionRow) {
    const itemTr = document.createElement('tr')
    const itemTd = document.createElement('td')
    itemTd.setAttribute('colspan', 7)
    const itemTable = document.createElement('table');
    itemTable.classList.add('itemTable');
    const itemContainer = document.createElement('tbody')
    itemContainer.className = 'itemContainer'
    itemTable.appendChild(itemContainer)
    itemTd.appendChild(itemTable)
    itemTr.appendChild(itemTd)
    sectionRow.parentNode.insertBefore(itemTr, sectionRow.nextSibling);
    createItemRows(sectionRow, itemContainer);
    createNewItemBtnContainer(itemTable, itemContainer, sectionRow.id)
    setDragListeners(itemContainer, sectionRow.id)
}

function createNewItemBtnContainer(itemTable, itemContainer, sectionId) {
    const newItemBtnContainer = document.createElement('div')
    itemTable.appendChild(newItemBtnContainer)
    const newItemButton = createItemButton(itemContainer, sectionId)
    newItemBtnContainer.appendChild(newItemButton)
}

function createItemRows(sectionRow, itemContainer) {
    const sectionIndex = getSectionIndex(sectionRow.id);
    const menuItems = jsonData.MenuSections[sectionIndex].MenuItems;
    
    menuItems.forEach(menuItem => {
        const itemRow = createItem(menuItem, sectionRow.id, itemContainer)
        itemContainer.appendChild(itemRow);
    });
}

function createItem(menuItem, sectionId, itemContainer) {
    const itemRow = document.createElement('tr');
    itemRow.classList.add('itemRow');
    itemRow.classList.add('draggable');
    itemRow.classList.add('folded')
    itemRow.id = menuItem.MenuItemId

    //Creates Dropdown Cell
    const itemDropDownCell = createItemDropdown(itemRow)
    itemRow.appendChild(itemDropDownCell)

    //Creates Drag Cell
    const itemDragCell = createItemDragCell(itemRow);
    itemRow.appendChild(itemDragCell)

    //Creates Buttons Cell
    const itemButtonsCell = createItemButtonsCell(itemRow, menuItem, sectionId, itemContainer);
    itemRow.appendChild(itemButtonsCell)

    //Creates Section Name Cell
    const itemNameCell = createItemNameCell(itemRow, menuItem, sectionId)
    itemRow.appendChild(itemNameCell)

    //Desc Cell
    const itemDescCell = createItemDescCell(itemRow, menuItem, sectionId)
    itemRow.appendChild(itemDescCell)

    //Price Cell
    const itemPriceCell = createItemPriceCell(itemRow, menuItem, sectionId)
    itemRow.appendChild(itemPriceCell)

    //Tax Cell
    const itemTaxCell = createItemTaxCell(menuItem, jsonData)
    itemRow.appendChild(itemTaxCell)

    return itemRow
}

export {
    createItemContainer,
    createItem,
}