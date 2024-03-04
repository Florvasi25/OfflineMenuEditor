import { 
    jsonData,
    getSectionIndex, 
} from '../context.js'

import { createItemNameCell } from './itemName.js'
import { createItemDropdown } from './itemDropDown.js'
import { createItemDragCell } from './itemDragAndDrop.js'
import { createItemButtonsCell } from './itemButtonContainer.js'
import { createItemButton } from './itemAddNew.js'
import { createItemDescCell } from './itemDescription.js'
import { createItemReturnCell } from './itemReturn.js'
import { createItemPriceCell, } from './itemPrice.js'
import { createItemTaxCell } from './itemTax.js'
import { changeItemClockIcon } from '../clock/itemClock.js'
import { clickCount } from '../mainContainer.js'


function createItemContainer(sectionRow) {
    const itemTable = document.createElement('div');
    itemTable.classList.add('itemTable');
    const itemContainer = document.createElement('div')
    itemContainer.className = 'itemContainer'
    itemTable.appendChild(itemContainer)
    sectionRow.parentNode.insertBefore(itemTable, sectionRow.nextSibling);
    createItemRows(sectionRow, itemContainer);
    createNewItemBtnContainer(itemTable, itemContainer, sectionRow.id)

    if (itemTable) {
        var itemTableParagraphs = itemTable.querySelectorAll('p');
        itemTableParagraphs.forEach(function(paragraph) {
            var currentSize = parseInt(window.getComputedStyle(paragraph).fontSize);
            paragraph.style.fontSize = (currentSize + clickCount) + 'px';
        });
    }
}

function createNewItemBtnContainer(itemTable, itemContainer, sectionId) {
    const newItemBtnContainer = document.createElement('div')
    newItemBtnContainer.className = 'newItemBtnContainer'
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
    const itemRow = document.createElement('div');
    itemRow.classList.add('itemRow');
    itemRow.classList.add('draggable');
    itemRow.classList.add('folded')
    itemRow.id = menuItem.MenuItemId

    //Creates Dropdown Cell
    const itemDropDownCell = createItemDropdown(itemRow, sectionId)
    itemRow.appendChild(itemDropDownCell)

    //Creates Drag Cell
    const itemDragCell = createItemDragCell(itemRow);
    itemRow.appendChild(itemDragCell)

    //Creates Buttons Cell
    const itemButtonsCell = createItemButtonsCell(itemRow, menuItem, sectionId, itemContainer);
    itemRow.appendChild(itemButtonsCell)
    changeItemClockIcon(itemRow, menuItem.MenuItemId);

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

    // Deposit Return Fee
    const itemReturnCell = createItemReturnCell(menuItem);
    itemRow.appendChild(itemReturnCell)

    return itemRow
}

export {
    createItemContainer,
    createItem,
    createItemRows
}