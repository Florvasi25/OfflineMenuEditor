import {
    updateLocalStorage,
    jsonData,
    getItemIndex,
} from '../context.js'

function createItemPriceCell(itemRow, menuItem, sectionId) {
    //Price Cell
    const itemPriceCell = document.createElement('div');
    itemPriceCell.classList.add('itemPriceCell');

    const itemPrice = createItemPrice(itemRow, menuItem, sectionId)
    itemPriceCell.appendChild(itemPrice);
    
    return itemPriceCell
}

//Handles Price Edits
function createItemPrice(itemRow, menuItem, sectionId) {
    const itemPrice = document.createElement('p');
    itemPrice.classList.add('itemPrice');
    itemPrice.contentEditable = true;
    
    const priceAsNumber = parseFloat(menuItem.Price);
    itemPrice.textContent = isNaN(priceAsNumber) ? '' : priceAsNumber.toFixed(2);

    let originalPrice = priceAsNumber;

    itemPrice.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updatePrice(itemRow.id, itemPrice.textContent, sectionId);
            originalPrice = parseFloat(itemPrice.textContent);
            itemPrice.blur();
        } else if (e.key === 'Escape') {
            itemPrice.textContent = originalPrice.toFixed(2);
            itemPrice.blur();
        }
    });

    itemPrice.addEventListener('blur', () => {
        itemPrice.textContent = originalPrice.toFixed(2);
        itemPrice.classList.remove('sectionClicked');
    });

    itemPrice.addEventListener('click', () => {
        if (itemPrice.textContent == "0.00") {
            itemPrice.textContent = ""
        }
        itemPrice.classList.add('sectionClicked');
    });

    itemPrice.addEventListener('input', () => {
        const newPrice = itemPrice.textContent;
        const removeCharacters = newPrice.replace(/[^\d.]/g, '');
        itemPrice.textContent = removeCharacters;
    });

    return itemPrice;
}

//Updates Price
function updatePrice(itemId, itemPrice, sectionId) {
    const { itemIndex, sectionIndex } = getItemIndex(sectionId, itemId);
    const priceAsNumber = parseFloat(parseFloat(itemPrice).toFixed(2));

    if (!isNaN(priceAsNumber)) {
        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].Price = priceAsNumber;
        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].ActualPrice = priceAsNumber;

        updateLocalStorage();
    }
}

export {
    createItemPriceCell,
    createItemPrice
}