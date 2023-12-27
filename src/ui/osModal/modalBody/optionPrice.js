import {
    updateLocalStorage,
    groupedOs,
    groupOptionSets,
    itemlessOs,
    updateItemlessLocalStorage
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
            let enteredPrice = optionPrice.textContent.trim();
            const regex = /^\d+(\.\d{1,})?$/; // Updated regex to allow one or more decimals
    
            if (regex.test(enteredPrice)) {
                // Ensure only two decimals are kept
                const roundedPrice = parseFloat(enteredPrice).toFixed(2);
                optionPrice.textContent = roundedPrice;
            } else {
                // Reset to original price if format is incorrect
                optionPrice.textContent = originalPrice.toFixed(2);
            }
            originalPrice = parseFloat(optionPrice.textContent);
    
            const indexOfOption = menuOs.MenuItemOptionSetItems.findIndex(
                option => option.MenuItemOptionSetItemId == menuOption.MenuItemOptionSetItemId
            );
            updatePrice(indexOfOption, menuOs, optionPrice.textContent);
    
            if (groupedOs[menuOs.groupOsId]) {
                const optionsIds = groupedOs[menuOs.groupOsId].map(
                    os => os.MenuItemOptionSetItems[indexOfOption].MenuItemOptionSetItemId.toString()
                );
                const optionPricePreviewArray = Array.from(document.getElementsByClassName('optionPricePreview'));
                const optionPricePreview = optionPricePreviewArray.filter(p => optionsIds.includes(p.id));
                optionPricePreview.forEach(os => {
                    os.textContent = parseFloat(optionPrice.textContent).toFixed(2);
                });
            }
            optionPrice.blur();
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
        if (optionPrice.textContent == '0.00') {
            optionPrice.textContent = '';
        }
        optionPrice.classList.add('sectionClicked');
    });

    optionPrice.addEventListener('input', () => {
        let newPrice = optionPrice.textContent;
    
        // Remove any characters that are not numbers or a dot after the first number
        newPrice = newPrice.replace(/[^\d.]/g, '');
    
        // Check if the new price starts with a dot or doesn't start with a number
        if (newPrice.startsWith('.') || !/^\d/.test(newPrice)) {
            newPrice = '';
        }
    
        // Check if there is more than one dot in the input
        const dotIndex = newPrice.indexOf('.');
        if (dotIndex !== -1) {
            const afterDot = newPrice.substr(dotIndex + 1);
            if (afterDot.includes('.')) {
                // Remove additional dots after the first one
                newPrice = newPrice.slice(0, dotIndex + afterDot.indexOf('.') + 1);
            }
        }
    
        optionPrice.textContent = newPrice;
    });

    return optionPrice;
}

function updatePrice(indexOfOption, menuOs, optionPrice) {
    const priceAsNumber = parseFloat(parseFloat(optionPrice).toFixed(2));

    if (!isNaN(priceAsNumber)) {

        if (groupedOs[menuOs.groupOsId]) {
            groupedOs[menuOs.groupOsId].forEach(os => {
                os.MenuItemOptionSetItems[indexOfOption].Price = priceAsNumber
            })
            groupOptionSets()
            updateLocalStorage()
        } else if (itemlessOs.includes(menuOs)){
            const option = menuOs.MenuItemOptionSetItems[indexOfOption]
            option.Price = priceAsNumber
            updateItemlessLocalStorage();
        }
    }
}

export {
    createOptionPriceCell,
    createOptionPrice
}