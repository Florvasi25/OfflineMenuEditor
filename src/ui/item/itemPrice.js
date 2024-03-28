import {
    updateLocalStorage,
    jsonData,
    getItemIndex,
} from '../context.js'

import { slotManagerInstance } from '../mainContainer.js';

function createItemPriceCell(itemRow, menuItem, sectionId) {
    // Price Cell
    const itemPriceCell = document.createElement('div');
    itemPriceCell.classList.add('itemPriceCell');

    hasMasterOptionSet(itemRow, menuItem, sectionId, itemPriceCell)

    return itemPriceCell;
}

function hasMasterOptionSet(itemRow, menuItem, sectionId, itemPriceCell) {
    const hasMasterOptionSet = menuItem.MenuItemOptionSets.some(optionSet => optionSet.IsMasterOptionSet === true);

    // If there is a master option set, hide the itemPriceCell
    if (hasMasterOptionSet) {
        itemPriceCell.style.display = 'none';
        const itemPrice = createItemPrice(itemRow, menuItem, sectionId)
        itemPriceCell.appendChild(itemPrice);
    } else {
        const itemPrice = createItemPrice(itemRow, menuItem, sectionId)
        itemPriceCell.appendChild(itemPrice);
    }
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
            let enteredPrice = itemPrice.textContent.trim();
            const regex = /^\d+(\.\d{1,})?$/; // Updated regex to allow one or more decimals
    
            if (regex.test(enteredPrice)) {
                // Ensure only two decimals are kept
                const roundedPrice = parseFloat(enteredPrice).toFixed(2);
                itemPrice.textContent = roundedPrice;
            } else {
                // Reset to original price if format is incorrect
                itemPrice.textContent = originalPrice.toFixed(2);
            }
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
    });

    itemPrice.addEventListener('click', () => {
        if (itemPrice.textContent === '0.00') {
            itemPrice.textContent = '';
        }
    });

    itemPrice.addEventListener('input', () => {
        let newPrice = itemPrice.textContent;
    
        // Remove any characters that are not numbers or a dot after the first number
        newPrice = newPrice.replace(/[^0-9.]/g, '');
    
        // Check if the new price starts with a dot or doesn't start with a number
        if (newPrice.startsWith('.') || !/^\d/.test(newPrice)) {
            newPrice = '';
        }
    
        // Check if a dot exists and if there are more dots after the first one
        const dotIndex = newPrice.indexOf('.');
        if (dotIndex !== -1) {
            const afterDot = newPrice.substr(dotIndex + 1);
            const dotCount = afterDot.split('.').length - 1;
            if (dotCount > 1) {
                // Remove additional dots after the first one
                const integerPart = newPrice.substr(0, dotIndex);
                const validDecimalPart = afterDot.replace(/\./g, '');
                newPrice = integerPart + '.' + validDecimalPart;
            }
        }
    
        // Allow only one dot after the first number
        const splitPrice = newPrice.split('.');
        if (splitPrice.length > 2) {
            newPrice = splitPrice[0] + '.' + splitPrice.slice(1).join('');
        }
    
        itemPrice.textContent = newPrice;
    });

    return itemPrice;
}

//Updates Price
function updatePrice(itemId, itemPrice, sectionId) {
    const { itemIndex, sectionIndex } = getItemIndex(sectionId, itemId);
    const priceAsNumber = parseFloat(parseFloat(itemPrice).toFixed(2));

    const excludedCheckbox = document.querySelector('.taxTypeCheckboxes .excludedCheckbox');
    const includedCheckbox = document.querySelector('.taxTypeCheckboxes .includedCheckbox');

    if (!isNaN(priceAsNumber)) {
        const item = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex]
        item.Price = priceAsNumber;
        item.ActualPrice = priceAsNumber;

        if (item.TaxRateId != null) {
            const itemTaxId = item.TaxRateId
            const taxRate = jsonData.TaxRates.find(tax => tax.TaxRateId == itemTaxId)
            const taxRatePercent = taxRate.Rate / 100
    
            if (excludedCheckbox.querySelector('input[type="checkbox"]').checked) {
                item.TaxValue = Number((item.Price * taxRatePercent).toFixed(2));
            } else if (includedCheckbox.querySelector('input[type="checkbox"]').checked) {
                item.TaxValue = Number(((item.Price * taxRatePercent) / (1 + taxRatePercent)).toFixed(2));
            }
        }

        updateLocalStorage(slotManagerInstance.currentSlot);
    }
}

export {
    createItemPriceCell,
    createItemPrice
}