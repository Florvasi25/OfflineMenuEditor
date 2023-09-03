import { 
    jsonData,
    getSectionIndex, 
} from './context.js'

import {
    createItemNameCell
} from './itemName.js'

import {
    createItemDropdown
} from './itemDropDown.js'

function createItemContainer(sectionRow) {
    const itemTable = document.createElement('table');
    itemTable.classList.add('itemTable');
    createItemRows(itemTable, sectionRow);
    sectionRow.parentNode.insertBefore(itemTable, sectionRow.nextSibling);
    const itemContainer = document.createElement('tbody')
    itemContainer.className = 'itemContainer'
    itemTable.appendChild(itemContainer)
}

function createItemRows(itemContainer, sectionRow) {
    const sectionIndex = getSectionIndex(sectionRow.id);
    const menuItems = jsonData.MenuSections[sectionIndex].MenuItems;
    
    menuItems.forEach(menuItem => {
        const itemRow = createItem(menuItem, sectionRow.id)
        itemContainer.appendChild(itemRow);
    });
}

function createItem(menuItem, sectionId) {
    const itemRow = document.createElement('tr');
    itemRow.classList.add('itemRow');
    itemRow.classList.add('draggable');
    itemRow.classList.add('folded')
    itemRow.id = menuItem.MenuItemId

    //Creates Dropdown Cell
    const itemDropDownCell = createItemDropdown(itemRow)
    itemRow.appendChild(itemDropDownCell)

    //Creates Drag Cell
    const itemDragCell = document.createElement('td');
    itemDragCell.classList.add('itemDragCell');
    itemRow.appendChild(itemDragCell)

    //Creates Buttons Cell
    const itemButtonsCell = document.createElement('td');
    itemButtonsCell.classList.add('itemButtonsCell');
    itemRow.appendChild(itemButtonsCell)

    //Creates Section Name Cell
    const itemNameCell = createItemNameCell(itemRow, menuItem, sectionId)
    itemRow.appendChild(itemNameCell)

    //Desc Cell
    const itemDescCell = document.createElement('td');
    itemDescCell.classList.add('itemDescCell');
    itemRow.appendChild(itemDescCell)

    // //OS Cell
    // const itemOsCell = document.createElement('td');
    // itemOsCell.classList.add('itemOsCell');
    // itemRow.appendChild(itemOsCell)

    //Price Cell
    const itemPriceCell = document.createElement('td');
    itemPriceCell.classList.add('itemPriceCell');
    itemRow.appendChild(itemPriceCell)

    //Tax Cell
    const itemTaxCell = document.createElement('td');
    itemTaxCell.classList.add('itemTaxCell');
    itemRow.appendChild(itemTaxCell)

    return itemRow
}

export {
    createItemContainer
}