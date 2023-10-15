import {
    updateLocalStorage,
    jsonData,
    getOptionIndex,
} from '../../context.js'

function createOptionPriceCell(menuOption, sectionId, itemId, osId) {
    //Price Cell
    const optionPriceCell = document.createElement('div');
    optionPriceCell.classList.add('optionPriceCell');

    const optionPrice = createOptionPrice(menuOption, sectionId, itemId, osId)
    optionPriceCell.appendChild(optionPrice);
    
    return optionPriceCell
}

//Handles Price Edits
function createOptionPrice(menuOption, sectionId, itemId, osId) {
    const optionPrice = document.createElement('p');
    optionPrice.classList.add('optionPrice');
    optionPrice.contentEditable = true;
    
    const priceAsNumber = parseFloat(menuOption.Price);
    optionPrice.textContent = isNaN(priceAsNumber) ? '' : priceAsNumber.toFixed(2);

    let originalPrice = priceAsNumber;

    optionPrice.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updatePrice(menuOption.MenuItemOptionSetItemId, sectionId, itemId, osId, optionPrice.textContent);
            originalPrice = parseFloat(optionPrice.textContent);
            optionPrice.blur();
            const optionPricePreviewArray = Array.from(document.getElementsByClassName('optionPricePreview')); 
            const optionPricePreview = optionPricePreviewArray.find((p) => p.id == menuOption.MenuItemOptionSetItemId)
            if (optionPricePreview) {
                optionPricePreview.textContent = optionPrice.textContent;
            }

        } else if (e.key === 'Escape') {
            optionPrice.textContent = originalPrice.toFixed(2);
            optionPrice.blur();
        }
    });

    optionPrice.addEventListener('blur', () => {
        optionPrice.textContent = originalPrice.toFixed(2);
        optionPrice.classList.remove('sectionClicked');
    });

    optionPrice.addEventListener('click', () => {
        optionPrice.classList.add('sectionClicked');
    });

    optionPrice.addEventListener('input', () => {
        const newPrice = optionPrice.textContent;
        const removeCharacters = newPrice.replace(/[^\d.]/g, '');
        optionPrice.textContent = removeCharacters;
    });

    return optionPrice;
}

//Updates Price
function updatePrice(optionId, sectionId, itemId, osId, optionPrice) {
    const {sectionIndex, itemIndex, osIndex, optionIndex} = getOptionIndex(sectionId, itemId, osId, optionId);
    const priceAsNumber = parseFloat(parseFloat(optionPrice).toFixed(2));
    
    if (!isNaN(priceAsNumber)) {
        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems[optionIndex].Price = priceAsNumber;

        updateLocalStorage();
    }
}

export {
    createOptionPriceCell,
    createOptionPrice
}