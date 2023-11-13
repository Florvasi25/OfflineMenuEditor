import {
    updateLocalStorage,
    groupedOs,
    groupOptionSets,
    itemlessOs,
    updateItemlessOsKey,
    updateOsDomIds,
    updateOptionDomIds
} from '../../context.js'

function createOptionPriceCell(menuOption, menuOs) {
    //Price Cell
    const optionPriceCell = document.createElement('div');
    optionPriceCell.classList.add('optionPriceCell');

    const optionPrice = createOptionPrice(menuOption, menuOs)
    optionPriceCell.appendChild(optionPrice);
    
    return optionPriceCell
}

//Handles Price Edits
function createOptionPrice(menuOption, menuOs) {
    const optionPrice = document.createElement('p');
    optionPrice.classList.add('optionPrice');
    optionPrice.contentEditable = true;
    
    const priceAsNumber = parseFloat(menuOption.Price);
    optionPrice.textContent = isNaN(priceAsNumber) ? '' : priceAsNumber.toFixed(2);

    let originalPrice = priceAsNumber;

    optionPrice.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            originalPrice = parseFloat(optionPrice.textContent);
            optionPrice.blur();
    
            const indexOfOption = menuOs.MenuItemOptionSetItems.findIndex(
                option => option.MenuItemOptionSetItemId == menuOption.MenuItemOptionSetItemId
            )

            updatePrice(indexOfOption, menuOs.groupOsId, optionPrice.textContent);
            
            const optionsIds = groupedOs[menuOs.groupOsId].map(
                os => os.MenuItemOptionSetItems[indexOfOption].MenuItemOptionSetItemId.toString()
            );
            const optionPricePreviewArray = Array.from(document.getElementsByClassName('optionPricePreview'));
            const optionPricePreview = optionPricePreviewArray.filter(p => optionsIds.includes(p.id));
            optionPricePreview.forEach(os => {
                os.textContent = menuOption.Price.toFixed(2)
            })
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

function updatePrice(indexOfOption, groupOsId, optionPrice) {
    const priceAsNumber = parseFloat(parseFloat(optionPrice).toFixed(2));

    if (!isNaN(priceAsNumber)) {

        if (groupedOs[groupOsId]) {
            groupedOs[groupOsId].forEach(os => {
                os.MenuItemOptionSetItems[indexOfOption].Price = priceAsNumber
            })
            groupOptionSets()
            updateLocalStorage()
        } else if (itemlessOs[groupOsId]) {
            const option = itemlessOs[groupOsId].MenuItemOptionSetItems.find(option => option.groupOptionId == groupOptionId)
            option.Price = priceAsNumber
            updateItemlessOsKey(groupOsId)
        }
    }
}

export {
    createOptionPriceCell,
    createOptionPrice
}